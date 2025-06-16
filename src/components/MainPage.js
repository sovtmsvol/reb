// src/components/MainPage.js
import React, { useState, useEffect } from "react";
import RebModalForm from "./RebModalForm";
import "./MainPage.css";

import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase-config";

const COLUMN_TITLES = [
  "№",
  "Назва",
  "Заводський номер",
  "Наряд",
  "Документ наряду",
  "Акт приймання",
  "Документ акту приймання",
  "Благодійка",
  "Акт приймання благодійки",
  "Акт технічного стану",
  "Акти технічного стану документ",
  "Актуальне місцезнаходження",
  "Матеріально відповідальна особа"
];

function MainPage() {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Завантажуємо дані з Firestore при першому рендері
  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "rebs"));
      const loadedRows = [];
      querySnapshot.forEach((doc) => {
        loadedRows.push({ id: doc.id, fields: doc.data().fields });
      });
      setRows(loadedRows);
    }
    fetchData();
  }, []);

  // Функція для завантаження файлу в Storage та отримання URL
  async function uploadFile(file, folder) {
    if (!file) return null;
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, name: file.name };
  }

  // Обробник збереження нового рядка з завантаженням файлів
  const handleSave = async (data) => {
    try {
      // Завантажуємо файли та отримуємо URL (якщо вони є)
      const orderFile = await uploadFile(data.orderFile, "orderFiles");
      const acceptanceFile = await uploadFile(data.acceptanceFile, "acceptanceFiles");
      const donationFile = await uploadFile(data.donationFile, "donationFiles");

      // techStateFiles - масив файлів, завантажуємо всі
      let techStateFiles = [];
      if (data.techStateFiles && data.techStateFiles.length > 0) {
        techStateFiles = await Promise.all(
          Array.from(data.techStateFiles).map(file => uploadFile(file, "techStateFiles"))
        );
      }

      // Формуємо об'єкт для збереження у Firestore
      const newRow = {
        fields: [
          data.name,
          data.serial,
          data.order,
          orderFile,
          data.acceptance,
          acceptanceFile,
          data.donation,
          donationFile,
          data.techState,
          techStateFiles,
          data.location,
          data.responsible
        ]
      };

      // Зберігаємо документ у Firestore
      const docRef = await addDoc(collection(db, "rebs"), newRow);

      // Додаємо новий рядок у локальний стан для відображення
      setRows(prev => [...prev, { id: docRef.id, fields: newRow.fields }]);

      // Закриваємо модалку
      setModalOpen(false);
    } catch (error) {
      console.error("Помилка при збереженні даних:", error);
      alert("Сталася помилка при збереженні даних. Перевірте консоль.");
    }
  };

  const filteredRows = rows.filter(row =>
    row.fields[0]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-container">
      <h1>Облік засобів РЕБ</h1>

      <input
        className="search-input"
        type="text"
        placeholder="🔍 Пошук за назвою засобу..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button className="add-button" onClick={() => setModalOpen(true)}>
        ➕ Додати засіб РЕБ
      </button>

      <table className="reb-table">
        <thead>
          <tr>
            {COLUMN_TITLES.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.fields[0]}</td>
              <td>{row.fields[1]}</td>
              <td>{row.fields[2]}</td>

              <td>
                {row.fields[3] ? (
                  <a href={row.fields[3].url} target="_blank" rel="noopener noreferrer">
                    {row.fields[3].name}
                  </a>
                ) : "-"}
              </td>

              <td>{row.fields[4]}</td>

              <td>
                {row.fields[5] ? (
                  <a href={row.fields[5].url} target="_blank" rel="noopener noreferrer">
                    {row.fields[5].name}
                  </a>
                ) : "-"}
              </td>

              <td>{row.fields[6]}</td>

              <td>
                {row.fields[7] ? (
                  <a href={row.fields[7].url} target="_blank" rel="noopener noreferrer">
                    {row.fields[7].name}
                  </a>
                ) : "-"}
              </td>

              <td>{row.fields[8]}</td>

              <td>
                {Array.isArray(row.fields[9]) && row.fields[9].length > 0 ? (
                  row.fields[9].map((fileObj, i) => (
                    <div key={i}>
                      <a href={fileObj.url} target="_blank" rel="noopener noreferrer">
                        {fileObj.name}
                      </a>
                    </div>
                  ))
                ) : "-"}
              </td>

              <td>{row.fields[10]}</td>
              <td>{row.fields[11]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <RebModalForm onClose={() => setModalOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
}

export default MainPage;
