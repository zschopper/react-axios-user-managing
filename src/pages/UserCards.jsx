import Alert from 'react-bootstrap/Alert';
import { useEffect, useState } from "react";

export default function UserCards(props) {
  let ds = props.dataService;
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    ds.getData("users", (status, response) => {
      console.log(status, response);
      if (status === 200) {
        setError("");
        setUsers(response);
      } else {
        setUsers([]);
        setError(response.message);
      }
    });
  }, [ds]);

  return (
    <article>
      <h2>Felhasználó kártyák</h2>

      {error && <Alert variant={"danger"}>{error}</Alert>}

      <div className="row gap-2">
        {users && users?.map((u, i) => (
          <UserCard key={i} user={u} />
        ))}
      </div>
    </article>
  );
}

function UserCard(prop) {
  let user = prop.user;
  return (
    <div className="col-sm-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <img
            src={`https://i.pravatar.cc/300?img=` + user.id}
            alt="avatar"
            style={{ width: "100%" }}
          />
          <h5 className="card-title">{user.name}</h5>
          <div className="card-text">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <b>Email:</b>
                </div>
                <div className="col-12">{user.email}</div>
              </div>
              <div className="row">
                <div className="col-12">
                  <b>Szül dátum:</b>
                </div>
                <div className="col-12">{user.dob}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
