import { Link } from "react-router-dom";
import "./EmployeeTable.css";

let order = 1;

function decideOrder() {
  order = order === 1 ? 0 : 1;
  console.log(order)
  return order
}



const EmployeeTable = ({ missing, employees, onDelete, filterEmployees, sortEmployees, updateMissing, setMissing }) => (
  <div className="EmployeeTable">
    <table>
      <thead>
        <tr>
          <th>Name
          <a  onClick={() => sortEmployees("name", 1)}> ˄</a>
          <a  onClick={() => sortEmployees("name", 0)}> ˅</a>
          <a className="button"  onClick={async (e) => sortEmployees("midname", decideOrder())}>Sort by middle name</a>
          <a className="button" onClick={async (e) => sortEmployees("lname", decideOrder())}>Sort by last name</a>
          </th>
          <th>Level
          <a  onClick={async (e) => sortEmployees("level", 1)}> ˄</a>
          <a  onClick={async (e) => sortEmployees("level", 0)}> ˅</a>
          <input className="list" type={"text"} onChange={async (e) => filterEmployees("level", e.target.value)}>
          </input>
          </th>
          <th>Position
          <a  onClick={async (e) => sortEmployees("position", 1)}> ˄</a>
          <a  onClick={async (e) => sortEmployees("position", 0)}> ˅</a>
          <input className="list" type={"text"} onChange={async (e) => filterEmployees("position", e.target.value)}>
          </input>
          </th>
          <th>
          <a href="/">Employees</a>
          <a href="/missing">Missing</a>
          </th>
          
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee._id} postid={employee._id}>
            <td>{employee.name}</td>
            <td>{employee.level}</td>
            <td>{employee.position}</td>
            <td>
              <Link to={`/update/${employee._id}`}>
                <button type="button">Update</button>
              </Link>
              <button type="button" onClick={() => onDelete(employee._id)}>
                Delete
              </button>
              <input defaultChecked={!employee.missing} type="checkbox" onChange={(e) => updateMissing(e, employee, employees, missing, setMissing)}>
              </input>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EmployeeTable;
