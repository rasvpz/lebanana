
  const empDetails = [
    { name: "Jane", age: 25, salary: 20000 },
    { name: "Ram", age: 40, salary: 30000 },
    { name: "Veena", age: 30, salary: 17500 }
  ];


    <div>
      {empDetails.map((emp, index) => (
        <h1 key={index}>{emp.name}</h1>
      ))}
    </div>


