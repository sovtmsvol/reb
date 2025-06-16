import React, { useState } from "react";
import "./RebModalForm.css";

function RebModalForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    serial: "",
    order: "",
    orderFile: null,
    acceptance: "",
    acceptanceFile: null,
    donation: "",
    donationFile: null,
    techState: "",
    techStateFiles: [], // кілька файлів
    location: "",
    responsible: ""
  });

  // Для відображення назв файлів
  const [filePreviews, setFilePreviews] = useState({
    orderFileName: "",
    acceptanceFileName: "",
    donationFileName: "",
    techStateFileNames: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "techStateFiles") {
      // Кілька файлів
      setFormData(prev => ({ ...prev, [name]: files }));
      setFilePreviews(prev => ({
        ...prev,
        techStateFileNames: Array.from(files).map(f => f.name)
      }));
    } else {
      // Окремий файл
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setFilePreviews(prev => ({ ...prev, [`${name}Name`]: files[0]?.name || "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Валідація (при бажанні додати)

    // Відправляємо дані в MainPage через onSave
    onSave(formData);

    // Закриваємо форму
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Додати засіб РЕБ</h2>
        <form onSubmit={handleSubmit} className="reb-form">

          <label>
            Назва:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            Заводський номер:
            <input type="text" name="serial" value={formData.serial} onChange={handleChange} />
          </label>

          <label>
            Наряд (№ та дата):
            <input type="text" name="order" value={formData.order} onChange={handleChange} />
          </label>

          <label>
            Документ наряду (PDF):
            <input type="file" name="orderFile" accept="application/pdf" onChange={handleFileChange} />
            {filePreviews.orderFileName && <span className="file-name">{filePreviews.orderFileName}</span>}
          </label>

          <label>
            Акт приймання (№ та дата):
            <input type="text" name="acceptance" value={formData.acceptance} onChange={handleChange} />
          </label>

          <label>
            Документ акту приймання (PDF):
            <input type="file" name="acceptanceFile" accept="application/pdf" onChange={handleFileChange} />
            {filePreviews.acceptanceFileName && <span className="file-name">{filePreviews.acceptanceFileName}</span>}
          </label>

          <label>
            Благодійка (№ та дата):
            <input type="text" name="donation" value={formData.donation} onChange={handleChange} />
          </label>

          <label>
            Акт приймання благодійки (PDF):
            <input type="file" name="donationFile" accept="application/pdf" onChange={handleFileChange} />
            {filePreviews.donationFileName && <span className="file-name">{filePreviews.donationFileName}</span>}
          </label>

          <label>
            Акт технічного стану (№ та дата):
            <input type="text" name="techState" value={formData.techState} onChange={handleChange} />
          </label>

          <label>
            Акти технічного стану документ (PDF, кілька):
            <input type="file" name="techStateFiles" accept="application/pdf" multiple onChange={handleFileChange} />
            {filePreviews.techStateFileNames.length > 0 && (
              <ul className="file-list">
                {filePreviews.techStateFileNames.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            )}
          </label>

          <label>
            Актуальне місцезнаходження:
            <input type="text" name="location" value={formData.location} onChange={handleChange} />
          </label>

          <label>
            Матеріально відповідальна особа:
            <input type="text" name="responsible" value={formData.responsible} onChange={handleChange} />
          </label>

          <div className="form-buttons">
            <button type="submit" className="save-button">Зберегти</button>
            <button type="button" className="cancel-button" onClick={onClose}>Відміна</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RebModalForm;
