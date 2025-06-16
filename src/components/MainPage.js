// src/components/MainPage.js
import React, { useState } from "react";
import RebModalForm from "./RebModalForm";
import "./MainPage.css";

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

  const handleAddReb = () => {
    setModalOpen(true);
  };

  const handleSave = (data) => {
    const newRow = {
      id: rows.length + 1,
      fields: [
        data.name,
        data.serial,
        data.order,
        data.orderFile ? { url: URL.createObjectURL(data.orderFile), name: data.orderFile.name } : null,
        data.acceptance,
        data.acceptanceFile ? { url: URL.createObjectURL(data.acceptanceFile), name: data.acceptanceFile.name } : null,
        data.donation,
        data.donationFile ? { url: URL.createObjectURL(data.donationFile), name: data.donationFile.name } : null,
        data.techState,
        data.techStateFiles.length > 0
          ? Array.from(data.techStateFiles).map(file => ({ url: URL.createObjectURL(file), name: file.name }))
          : [],
        data.location,
        data.responsible
      ]
    };

    setRows(prev => [...prev, newRow]);
    setModalOpen(false);
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

      <button className="add-button" onClick={handleAddReb}>
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
