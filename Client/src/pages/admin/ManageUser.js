import React, { useEffect, useState, useCallback } from "react";
import { apiGetUsers, apiUpdateUsers, apiDeleteUsers } from '../../apis'

import moment from "moment";
import { roles } from "../../ultils/contants";
import { InputField, Pagination, Select } from "../../components/index";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { InputForm } from "../../components";
import { useForm } from "react-hook-form";
import ModalUpdateUser from "../../components/modalUpdateUser/ModalUpdateUser";
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [users, setUsers] = useState(null);
  const [updateUser, setUpdateUser] = useState(null);
  const [queries, setQueries] = useState({
    q: "",
  });
  
  const [update, setUpdate] = useState(false)

  
  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])

	

  

  const [params] = useSearchParams();

  const fectchUser = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) setUsers(response);
  };

  const queriesDebounce = useDebounce(queries.q, 800);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fectchUser(queries);
  }, [queriesDebounce, params]);

  //dong mo edit
  const handleOpenModal = (user) => {
    setIsModalOpen(true);
    setUpdateUser(user);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUpdateUser(null);
  };

  const handleUpdate = async (userData) => {
   
    const response = await apiUpdateUsers(userData, userData._id)
    if (response.success) {
      
      render()
      toast.success(response.message)
	  setIsModalOpen(false);
    }
    else {
      toast.error(response.message)
    }
  };
  const handldeDeleteUser = (uid) => {
    Swal.fire({
      title: 'Are you sure...',
      text: 'Are you ready remove this user?',
      showCancelButton: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        const response = await apiDeleteUsers(uid)
        if (response.success) {
          render()
          toast.success(response.message)
        }
        else {
          toast.error(response.message)
        }
      }
    })
  }

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Manage Users</span>
      </h1>

      <div className="w-full p-4">
        <div className="flex items-center justify-end py-4 ">
          <InputField
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            style={"w-[500px]"}
            placeholder="search name user..."
            isHideLabel
          />
        </div>
        <table className="table-auto mb-6 w-full">
          <thead className="font-bold  text-[13px] border border-black text-center">
            <tr>
              <th className="px-4 py-2">Stt</th>
              <th className="px-4 py-2">Email Adress</th>
              <th className="px-4 py-2">Fisrtname</th>
              <th className="px-4 py-2">Lastname</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">createdAt</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.Users?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="py-4">{idx + 1}</td>
                <td className="py-4">{el?.email}</td>
                <td className="py-4">{el?.firstname}</td>
                <td className="py-4">{el?.lastname}</td>
                <td className="py-4">{el?.address}</td>
                <td className="py-4">{el?.mobile}</td>
                <td className="py-4">
                  <span>
                    {roles.find((role) => +role.code === +el.role)?.value}
                  </span>
                </td>
                <td className="py-4">
                  <span>{el.isBlocked ? "Blocked" : "Active"}</span>
                </td>
                <td className="py-4">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="py-4">
                  <span
                    className="px-2 text-orange-600 hover:underline cursor-pointer"
                    onClick={() => handleOpenModal(el)}
                  >
                    Edit
                  </span>
                  <span onClick={() => handldeDeleteUser(el._id)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-ful text-rightx">
          <Pagination totalCount={users?.counts}/>
        </div>
      </div>
      {isModalOpen && (
        <ModalUpdateUser
          onClose={handleCloseModal}
          updateUser={updateUser}
          setUpdateUser={setUpdateUser}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ManageUser;
