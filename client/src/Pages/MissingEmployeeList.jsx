import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import MissingEmployeeTable from "../Components/EmployeeTable";

async function updateMissing(e, oneEmployee, employees, missing, setMissing) {
  console.log(missing)
  const tempName = oneEmployee.name

  if (!e.target.checked){
    missing.push(employees.filter(obj => obj.name === tempName))

  } else {
    
    const indexToDelete = missing.findIndex(obj => obj.name === tempName)
    missing.splice(indexToDelete, 1)
    console.log(indexToDelete)
  }
  missing = missing.flat()
  await fetch("/api/missingemployees", {
    method: "PATCH",
    body: JSON.stringify({missing}),
    headers: {
      "content-type": "application/json"
    }
})

}

const sortMechanism = (filterBy, order, data) => {
  if(order) {
    data = data.sort((a, b) => {
     if ( a[filterBy] < b[filterBy] ){
       return -1;
     }
     if ( a[filterBy] > b[filterBy] ){
       return 1;
     }
     return 0;
   })
   } else {
    data = data.sort((b, a) => {
      if ( a[filterBy] < b[filterBy] ){
        return -1;
      }
      if ( a[filterBy] > b[filterBy] ){
        return 1;
      }
      return 0;
    })
  }
  return data;
}

const fetchEmployees = (signal) => {
  return fetch("/api/missingemployees", { signal }).then((res) => res.json());
};

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
}

const MissingEmployeeList = () => {
  const [backupData, setBackupData] = useState(null)
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [missing, setMissing] = useState([])

  const filterEmployees = (filterBy, string) => {
    const filteredData = backupData.filter((obj) => {
    return obj[filterBy].toLowerCase().includes(string.toLowerCase())})
    setData(filteredData)
  }
  
  const sortEmployees = (sortBy, order) => {
    const sortedData = [...sortMechanism(sortBy, order, data)]
    setData(sortedData)
  }

  const handleDelete = (id) => {
    deleteEmployee(id).catch((err) => {
      console.log(err);
    });

    setData((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchEmployees(controller.signal)
      .then((employees) => {
        setLoading(false);
        setData(employees);
        setBackupData(employees);
        setMissing(employees)
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setData(null);
          throw error;
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <MissingEmployeeTable missing={missing} employees={data} onDelete={handleDelete} updateMissing={updateMissing} filterEmployees={filterEmployees} sortEmployees={sortEmployees} setMissing={setMissing} />;
};

export default MissingEmployeeList;
