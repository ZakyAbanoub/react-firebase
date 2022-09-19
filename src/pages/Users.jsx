import axios from "axios";
import { useState, useEffect } from "react";

//Add Form Nested (Internal) Component
const AddUserForm = (props) => {
  const { emitToParent } = props;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  //POST API
  const addUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://react-firebase-5fcda-default-rtdb.europe-west1.firebasedatabase.app/users.json",
        {
          firstName,
          lastName,
        }
      );
      setFirstName("");
      setLastName("");
      emitToParent();
    } catch (e) {
      console.log(e);
    }
  };

  //The Form
  return (
    <div className="container mx-auto mt-5">
      <form className="md:w-1/2 mx-auto" onSubmit={addUser}>
        <div>
          <label>First Name</label>
          <input
            value={firstName}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="mt-3">
          <label>Last Name</label>
          <input
            value={lastName}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <button
          className="bg-sky-500 hover:bg-sky-700 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white mt-3"
          type="submit"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

//Users Page
const Users = (props) => {
  //Users State
  const [users, setUsers] = useState([]);
  const [editingUserIndex, setEditingUserIndex] = useState(null);
  const [editingFirstname, setEditingFirstname] = useState("");
  const [editingLastname, setEditingLastname] = useState("");

  //GET Users from firebase API
  const searchUsers = async () => {
    let usersArray = [];
    const usersFirebase = await axios.get(
      "https://react-firebase-5fcda-default-rtdb.europe-west1.firebasedatabase.app/users.json"
    );
    const usersData = usersFirebase.data;
    if (usersData) {
      for (let key in usersData) {
        usersArray.push({
          id: key,
          firstName: usersData[key].firstName,
          lastName: usersData[key].lastName,
        });
      }
      setUsers(usersArray);
    } else {
      setUsers([]);
    }
  };

  //Delete User By ID API
  const deleteUser = async (id) => {
    await axios.delete(
      `https://react-firebase-5fcda-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`
    );
    searchUsers();
  };

  //PUT Edit User API
  const editUser = async (id, index) => {
    await axios.put(
      `https://react-firebase-5fcda-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`,
      {
        firstName: editingFirstname,
        lastName: editingLastname,
      }
    );

    //After editing user we disable editing mode to show the new firstname and lastnaem
    disableEdit(index);
    searchUsers();
  };

  //Add Input Text to the table to edit firstname and lastname
  const enableEdit = async (index) => {
    setEditingUserIndex(index);
    setEditingFirstname(users[index].firstName);
    setEditingLastname(users[index].lastName);
  };

  //Disable Edit Mode
  const disableEdit = async (index) => {
    setEditingUserIndex((idx) => (idx === index ? null : idx));
    setEditingFirstname("");
    setEditingLastname("");
  };

  //Call searchUsers on mounted
  useEffect(() => {
    searchUsers();
  }, []);

  //When the users length is equal to 0
  if (!users.length) {
    return (
      <>
        <div className="h-screen flex flex-col justify-center items-center">
          <AddUserForm emitToParent={searchUsers} />
          <h1 className="font-bold text-2xl mt-5">
            Not Users Found! Please add a user!
          </h1>
        </div>
      </>
    );
  }

  //We show the table when the users length is more than 0
  return (
    <>
      <AddUserForm emitToParent={searchUsers} />
      <div className="container mx-auto mt-[5rem]">
        <table className="border-spacing-2 border-separate border border-slate-500 w-full">
          <thead>
            <tr>
              <th className="border border-slate-600">First Name</th>
              <th className="border border-slate-600">Last Name</th>
              <th className="border border-slate-600">Operations</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.length &&
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="border border-slate-700 p-2">
                    {/* When Editing Mode is enable show input otherwise show only firstname */}
                    {editingUserIndex !== index ? (
                      user.firstName
                    ) : (
                      <input
                        value={editingFirstname}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        onChange={(e) => setEditingFirstname(e.target.value)}
                        required
                      />
                    )}
                  </td>
                  <td className="border border-slate-700 p-2">
                    {/* When Editing Mode is enable show input otherwise show only lastname */}
                    {editingUserIndex !== index ? (
                      user.lastName
                    ) : (
                      <input
                        value={editingLastname}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        onChange={(e) => setEditingLastname(e.target.value)}
                        required
                      />
                    )}
                  </td>
                  {/* When Editing Mode is disable show the buttons Delete User and Edit User otherwise show the submit button to edit the user info  */}
                  {editingUserIndex !== index ? (
                    <td className="border border-slate-700 p-2 flex justify-center items-center">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-700 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white"
                        type="submit"
                      >
                        Delete User
                      </button>
                      <button
                        onClick={() => enableEdit(index)}
                        className="ml-3 bg-sky-500 hover:bg-sky-700 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white"
                        type="submit"
                      >
                        Edit User
                      </button>
                    </td>
                  ) : (
                    <td className="border border-slate-700 p-2 flex justify-center items-center">
                      <button
                        onClick={() => {
                          disableEdit(index);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-700 px-5 text-black py-2.5 text-sm leading-5 rounded-md font-semibold hover:text-white"
                        type="submit"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => editUser(user.id, index)}
                        className="ml-3 bg-green-500 hover:bg-green-700 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white"
                        type="submit"
                      >
                        Submit Changes
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Users;
