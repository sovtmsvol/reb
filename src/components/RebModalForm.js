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
    techStateFiles: [],
    location: "",
    responsible: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "techStateFiles") {
        setFormData((prev) => ({ ...prev, [name]: files }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Додати новий засіб РЕБ</h2>
        <form className="reb-form" onSubmit={handleSubmit}>
          <label>
            Назва:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            Заводський номер:
            <input type="text" name="serial" value={formData.serial} onChange={handleChange} required />
          </label>

          <label>
            Наряд:
            <input type="text" name="order" value={formData.order} onChange={handleChange} />
          </label>

          <label>
            Документ наряду (PDF, JPG тощо):
            <input type="file" name="orderFile" onChange={handleChange} />
          </label>

          <label>
            Акт приймання:
            <input type="text" name="acceptance" value={formData.acceptance} onChange={handleChange} />
          </label>

          <label>
            Документ акту приймання:
            <input type="file" name="acceptanceFile" onChange={handleChange} />
          </label>

          <label>
            Благодійка:
            <input type="text" name="donation" value={formData.donation} onChange={handleChange} />
          </label>

          <label>
            Документ благодійки:
            <input type="file" name="donationFile" onChange={handleChange} />
          </label>

          <label>
            Акт технічного стану:
            <input type="text" name="techState" value={formData.techState} onChange={handleChange} />
          </label>

          <label>
            Документи акту техстану (можна кілька):
            <input type="file" name="techStateFiles" multiple onChange={handleChange} />
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
            <button type="button" className="cancel-button" onClick={onClose}>Скасувати</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RebModalForm;
