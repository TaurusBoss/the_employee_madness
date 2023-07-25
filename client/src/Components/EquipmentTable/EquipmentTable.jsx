import { Link } from "react-router-dom";
import "./EquipmentTable.css";

let order = "asc"

function decideOrder() {
  order = order === "asc" ? "desc" : "asc";
  console.log(order)
  return order
}

const EquipmentTable = ({ equipments, onDelete, setData, fetchEmployeesSorted, fetchEmployeesFiltered }) => (
  <div className="EmployeeTable">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Quantity</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        {equipments.map((equipment) => (
          <tr key={equipment._id}>
            <td>{equipment.name}</td>
            <td>{equipment.type}</td>
            <td>{equipment.quantity}</td>
            <td>
              <Link to={`/updateEquipment/${equipment._id}`}>
                <button type="button">Update</button>
              </Link>
              <button type="button" onClick={() => onDelete(equipment._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EquipmentTable;
