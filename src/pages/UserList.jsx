import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Alert";
import { useEffect, useState } from "react";
// import { Spinner } from "../components/Spinner.jsx";
import UserModal from "./UserModal.jsx";
import Spinner from "../components/Spinner.jsx";

export default function UserList(props) {
  let ds = props.dataService;
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  // const [activeUser, setActiveUser] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    user: {},
    readOnly: false,
    visible: false,
    saveEvent: null,
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
    })
  };

  // megnyitja a formot, betölti a felhasználót megtekintésre
  const UserShowEvent = (user) => {
    console.log("UserShowEvent", user);
    setModalState({
      user: user,
      readOnly: true,
      visible: true,
      saveEvent: null,
    })
  };

  // megnyitja a formot, betölti a felhasználót szerkesztésre
  const UserEditEvent = (user, saveEvent) => {
    console.log("UserEditEvent", user, saveEvent);
    setModalState({
      user: user,
      readOnly: false,
      visible: true,
      saveEvent: UserUpdateEvent,
    })
  };

  // elküldi az új felhasználót a szervernek
  const UserStoreEvent = () => {
    console.log("UserStoreEvent");
  };

  // elküldi a létező felhasználót a szervernek
  const UserUpdateEvent = (user) => {
    console.log("UserUpdateEvent", user);
  };

  // törli a felhasználót
  const UserDeleteEvent = (user) => {
    console.log("UserDeleteEvent", user);
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
        ></i>
        <i
          className="fa-regular fa-user-pen"
          onClick={() => {
            props.events.edit(user, props.events.update);
          }}
        ></i>
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
