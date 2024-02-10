import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import UserModal from "./UserModal.jsx";
import Spinner from "../components/Spinner.jsx";

export default function UserList(props) {
  let ds = props.dataService;
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    user: {},
    readOnly: false,
    visible: false,
    saveEvent: null,
    messages: [],
  });

  useEffect(() => {
    setLoading(true);
    ds.getData("users", (status, response) => {
      console.log(status, response);
      if (status === 200) {
        setError("");
        setUsers(response);
      } else {
        setUsers([]);
        setError(response.message);
      }
      setLoading(false);
    });
  }, [ds]);

  const UserIndexEvent = () => {
    console.log("UserIndexEvent");
  };

  // megnyitja a formot, betölti egy új felhasználót szerkesztésre
  const UserCreateEvent = (user, saveEvent) => {
    console.log("UserCreateEvent", user, saveEvent);
    setModalState({
      user: {},
      readOnly: false,
      visible: true,
      saveEvent: UserStoreEvent,
      messages: [],
    });
  };

  // megnyitja a formot, betölti a felhasználót megtekintésre
  const UserShowEvent = (user) => {
    console.log("UserShowEvent", user);
    setModalState({
      user: user,
      readOnly: true,
      visible: true,
      saveEvent: null,
      messages: [],
    });
  };

  // megnyitja a formot, betölti a felhasználót szerkesztésre
  const UserEditEvent = (user, saveEvent) => {
    console.log("UserEditEvent", user, saveEvent);
    setModalState({
      user: user,
      readOnly: false,
      visible: true,
      saveEvent: UserUpdateEvent,
      messages: [],
    });
  };

  // elküldi az új felhasználót a szervernek
  const UserStoreEvent = (user) => {
    console.log("UserStoreEvent", user);
      setLoading(true);
      ds.postData("users", user, (status, response) => {
        console.log(status, response);
        if (status >= 200 && status <= 299) {
          setError("");
          setUsers([...users, response]);
        } else {
          setError(response.message);
        }
        setLoading(false);
      });
  };

  console.log(users);

  // elküldi a létező felhasználót a szervernek
  const UserUpdateEvent = (user) => {
    console.log("UserUpdateEvent", user);
    setLoading(true);
    ds.putData( `users/${user.id}`, user, (status, response) => {
      console.log(status, response);
      if (status >= 200 && status <= 299) {
        setError("");
        const idx = users.findIndex((u) => user.id === response.id);
        const newUsers = [...users];
        newUsers[idx] = response;
        setUsers(newUsers);
      } else {
        setError(response.message);
      }
      setLoading(false);
    });

  };

  // törli a felhasználót
  const UserDeleteEvent = (user) => {
    console.log("UserDeleteEvent", user);
    setLoading(true);
    ds.deleteData( `users/${user.id}`, (status, response) => {
      console.log(status, response);
      if (status >= 200 && status <= 299) {
        setError("");
        const idx = users.findIndex((u) => user.id === u.id);
        const newUsers = [...users];
        newUsers.splice(idx, 1);
        setUsers(newUsers);
      } else {
        setError(response.message);
      }
      setLoading(false);
    });
  };

  let events = {
    index: UserIndexEvent,
    create: UserCreateEvent,
    store: UserStoreEvent,
    show: UserShowEvent,
    edit: UserEditEvent,
    update: UserUpdateEvent,
    destroy: UserDeleteEvent,
  };

  return (
    <article>
      <h2>Felhasználó lista</h2>
      <Button variant="primary" onClick={() => events.create()}>
        Új felhasználó
      </Button>
      {error && <Alert variant={"danger"}>{error}</Alert>}
      <Spinner shown={loading} />
      <Table dataService={props.dataService} events={events} users={users} />
      {modalState && <UserModal state={modalState} setState={setModalState} />}
    </article>
  );
}

function Table(props) {
  return (
    <table className="table">
      <TableHead
        dataService={props.dataService}
        events={props.events}
        users={props.users}
      />
      <TableBody
        dataService={props.dataService}
        events={props.events}
        users={props.users}
      />
    </table>
  );
}

function TableHead(props) {
  return (
    <thead>
      <tr>
        <th>Akciók</th>
        <th>Név</th>
        <th>Szül dátum</th>
        <th>E-mail</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  return (
    <tbody>
      {props?.users?.map((u, i) => (
        <TableRow
          key={i}
          dataService={props.dataService}
          events={props.events}
          user={u}
        />
      ))}
    </tbody>
  );
}

function TableRow(props) {
  let user = props.user;
  return (
    <tr>
      <td>
        <i
          className="fa-regular fa-eye"
          onClick={() => {
            props.events.show(user);
          }}
        ></i>&nbsp;
        <i
          className="fa-regular fa-user-pen"
          onClick={() => {
            props.events.edit(user, props.events.update);
          }}
        ></i>&nbsp;
        <i
          className="fa-regular fa-user-minus"
          onClick={() => {
            props.events.destroy(user);
          }}
        ></i>
      </td>
      <td>{user.name}</td>
      <td>{user.dob}</td>
      <td>{user.email}</td>
    </tr>
  );
}
