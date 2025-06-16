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

  const sanitizeFileName = (originalName) => {
    const timestamp = Date.now();
    const ext = originalName.split(".").pop();
    const base = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    return `${timestamp}_${base}.${ext}`;
  };

  async function uploadFile(file, folder) {
    if (!file || !(file instanceof File)) return null;

    const safeName = sanitizeFileName(file.name);
    const filePath = `${folder}/${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("reb-files")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Помилка при завантаженні файлу:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("reb-files")
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, name: file.name };
  }

  const handleSave = async (data) => {
    try {
      console.log("Форма відправлена з даними:", data);

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

      if (error) {
        console.error("Помилка вставки в Supabase:", error);
        throw error;
      }

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
        + Додати засіб РЕБ
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
          {filteredRows.map((row, rowIndex) => (
            <tr key={row.id}>
              <td>{rowIndex + 1}</td>
              {row.fields.map((field, i) => {
                // Однофайлові посилання
                if (i === 3 || i === 5 || i === 7) {
                  return (
                    <td key={i}>
                      {field ? (
                        <a href={field.url} target="_blank" rel="noopener noreferrer">
                          {field.name}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  );
                }

                // Масив файлів
                if (i === 9) {
                  return (
                    <td key={i}>
                      {Array.isArray(field) && field.length > 0 ? (
                        field.map((fileObj, j) => (
                          <div key={j}>
                            <a href={fileObj.url} target="_blank" rel="noopener noreferrer">
                              {fileObj.name}
                            </a>
                          </div>
                        ))
                      ) : (
                        "-"
                      )}
                    </td>
                  );
                }

                // Інші поля
                return <td key={i}>{field || "-"}</td>;
              })}
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
