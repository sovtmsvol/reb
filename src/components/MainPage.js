// src/components/MainPage.js
import React, { useState, useEffect } from "react";
import RebModalForm from "./RebModalForm";
import "./MainPage.css";
import { supabase } from "../supabaseClient";

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

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("rebs")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Помилка при завантаженні:", error);
      } else {
        const loadedRows = data.map((row) => ({
          id: row.id,
          fields: [
            row.name,
            row.serial,
            row.order,
            row.order_file,
            row.acceptance,
            row.acceptance_file,
            row.donation,
            row.donation_file,
            row.tech_state,
            row.tech_state_files,
            row.location,
            row.responsible
          ]
        }));
        setRows(loadedRows);
      }
    }
    fetchData();
  }, []);

  async function uploadFile(file, folder) {
    if (!file) return null;
    const filename = `${folder}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("reb-files")
      .upload(filename, file);
    if (uploadError) {
      console.error("Помилка при завантаженні файлу:", uploadError);
      return null;
    }
    const { data: urlData } = supabase.storage
      .from("reb-files")
      .getPublicUrl(filename);
    return { url: urlData.publicUrl, name: file.name };
  }

  const handleSave = async (data) => {
    try {
      const orderFile = await uploadFile(data.orderFile, "orderFiles");
      const acceptanceFile = await uploadFile(data.acceptanceFile, "acceptanceFiles");
      const donationFile = await uploadFile(data.donationFile, "donationFiles");

      let techStateFiles = [];
      if (data.techStateFiles && data.techStateFiles.length > 0) {
        techStateFiles = await Promise.all(
          Array.from(data.techStateFiles).map((file) =>
            uploadFile(file, "techStateFiles")
          )
        );
      }

      const { data: newRow, error } = await supabase
        .from("rebs")
        .insert([
          {
            name: data.name,
            serial: data.serial,
            order: data.order,
            order_file: orderFile,
            acceptance: data.acceptance,
            acceptance_file: acceptanceFile,
            donation: data.donation,
            donation_file: donationFile,
            tech_state: data.techState,
            tech_state_files: techStateFiles,
            location: data.location,
            responsible: data.responsible
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setRows((prev) => [
        ...prev,
        {
          id: newRow.id,
          fields: [
            newRow.name,
            newRow.serial,
            newRow.order,
            newRow.order_file,
            newRow.acceptance,
            newRow.acceptance_file,
            newRow.donation,
            newRow.donation_file,
            newRow.tech_state,
            newRow.tech_state_files,
            newRow.location,
            newRow.responsible
          ]
        }
      ]);

      setModalOpen(false);
    } catch (error) {
      console.error("Помилка при збереженні:", error);
      alert("Не вдалося зберегти. Перевір консоль.");
    }
  };

  const filteredRows = rows.filter((row) =>
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
        Додати засіб РЕБ
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
                ) : (
                  "-"
                )}
              </td>

              <td>{row.fields[4]}</td>

              <td>
                {row.fields[5] ? (
                  <a href={row.fields[5].url} target="_blank" rel="noopener noreferrer">
                    {row.fields[5].name}
                  </a>
                ) : (
                  "-"
                )}
              </td>

              <td>{row.fields[6]}</td>

              <td>
                {row.fields[7] ? (
                  <a href={row.fields[7].url} target="_blank" rel="noopener noreferrer">
                    {row.fields[7].name}
                  </a>
                ) : (
                  "-"
                )}
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
                ) : (
                  "-"
                )}
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
