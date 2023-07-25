const EquipmentForm = ({ onSave, disabled, equipment, onCancel }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entries = [...formData.entries()];

    const equipment = entries.reduce((acc, entry) => {
      const [k, v] = entry;
      acc[k] = v;
      return acc;
    }, {});

    return onSave(equipment);
  };

  return (
    <form className="EquipmentForm" onSubmit={onSubmit}>
      {equipment && (
        <input type="hidden" name="_id" defaultValue={equipment._id} />
      )}

      <div className="control">
        <label htmlFor="name">Name:</label>
        <input
          defaultValue={equipment ? equipment.name : null}
          name="name"
          id="name"
        />
      </div>

      <div className="control">
        <label htmlFor="type">Type:</label>
        <input
          defaultValue={equipment ? equipment.type : null}
          name="type"
          id="type"
        />
      </div>

      <div className="control">
        <label htmlFor="quantity">Quantity:</label>
        <input
          defaultValue={equipment ? equipment.quantity : null}
          name="quantity"
          id="quantity"
        />
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {equipment ? "Update Equipment" : "Create Equipment"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;
