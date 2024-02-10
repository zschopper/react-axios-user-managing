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
    setLoading(true); // bekapcsoljuk a homokórát
    ds.getData("users", (status, response) => {
      if (status === 200) {
        setError(""); // kitöröljük a hibát
        setUsers(response); // beállítjuk a users állapotát a válaszban kapott listával
      } else {
        setUsers([]); // kiürítjük a felhasználólistát
        setError(response.message); // beállíjuk a hiba állapotát
      }
      setLoading(false); // kikapcsoljuk a homokórát
    });
  }, [ds]); // a ds itt függőség (a useEffect használja), de nem változik az értéke soha

  // nincs használatban
  const UserIndexEvent = () => {
    // console.log("UserIndexEvent");
  };

  // Megnyitja a formot, betölti egy új felhasználót szerkesztésre.
  // A saveEvent azért kell, mert átadunk egy függvényt, aminek le kell futnia,
  //   amikor a mentés gombra kattintanak a formon.
  const UserCreateEvent = (user, saveEvent) => {
    // console.log("UserCreateEvent", user, saveEvent);
    setModalState({
      user: {},
      readOnly: false,
      visible: true,
      saveEvent: UserStoreEvent,
      messages: [],
    });
  };

  // Megnyitja a formot, betölti a felhasználót megtekintésre.
  const UserShowEvent = (user) => {
    // console.log("UserShowEvent", user);
    setModalState({
      user: user,
      readOnly: true,
      visible: true,
      saveEvent: null,
      messages: [],
    });
  };

  // Megnyitja a formot, betölti a felhasználót szerkesztésre.
  // A saveEvent azért kell, mert átadunk egy függvényt, aminek le kell futnia,
  //   amikor a mentés gombra kattintanak a formon.
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

  // Elküldi az új felhasználót a szervernek.
  const UserStoreEvent = (user) => {
    // console.log("UserStoreEvent", user);
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

  // Elküldi a létező felhasználót a szervernek.
  const UserUpdateEvent = (user) => {
    // console.log("UserUpdateEvent", user);
    setLoading(true);
    ds.putData(`users/${user.id}`, user, (status, response) => {
      console.log(status, response);
      if (status >= 200 && status <= 299) {
        setError("");
        const idx = users.findIndex((u) => user.id === response.id); // megkeressük a módosított felhasználó indexét a users-ben
        const newUsers = [...users]; // lemásoljuk a users-t
        newUsers[idx] = response; // kicseréljük a módosított usert az újra.
        setUsers(newUsers); // újrarenderelünk
      } else {
        setError(response.message);
      }
      setLoading(false);
    });
  };

  // Törli a felhasználót.
  // Kellene ide egy megerősítés is a kérés kiküldése előtt.
  const UserDeleteEvent = (user) => {
    // console.log("UserDeleteEvent", user);
    setLoading(true);
    ds.deleteData(`users/${user.id}`, (status, response) => {
      console.log(status, response);
      if (status >= 200 && status <= 299) {
        setError("");
        const idx = users.findIndex((u) => user.id === u.id); // megkeressük a törölt felhasználót
        const newUsers = [...users]; // lemásoljuk a users-t
        newUsers.splice(idx, 1); // kitöröljük a törölt felhasználót
        setUsers(newUsers); // újrarenderelelés
      } else {
        setError(response.message);
      }
      setLoading(false);
    });
  };

  // Egy objektumba összegyűjtöttük a függvényeket, amiket a lista hívhat, egy tulajdonságként tudjuk így küldeni a props-nak.
  // A függvények referenciáit használjuk, nem hívjuk őket!
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
      {/* az onClick-ben a fenti events objektum create-jét hívjuk */}
      <Button variant="primary" onClick={() => events.create()}>
        Új felhasználó
      </Button>
      {/* feltétel && ... módon lehet feltételhez kötni a renderelést. Itt: ha van hiba, megjelenik az értesítési sáv. */}
      {error && <Alert variant={"danger"}>{error}</Alert>}
      <Spinner shown={loading} />
      <Table events={events} users={users} />
      {modalState && <UserModal state={modalState} setState={setModalState} />}
    </article>
  );
}

function Table(props) {
  return (
    <table className="table">
      <TableHead
        events={props.events}
        users={props.users}
      />
      <TableBody
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
        &nbsp;
        <i
          className="fa-regular fa-user-pen"
          onClick={() => {
            props.events.edit(user, props.events.update);
          }}
        ></i>
        &nbsp;
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
