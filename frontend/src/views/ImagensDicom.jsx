import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import Swal from 'sweetalert2';

export default function ImagensDicom() {
  const [imagens, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, [])

  const onDeleteClick = user => {
    Swal.fire({
      title: 'Tem certeza de que deseja excluir esta imagem?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, exclua!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/imagens-dicom/${user.id}`)
          .then(() => {
            Swal.fire(
              'Excluído!',
              'Imagem foi excluída com sucesso.',
              'success'
            );
            getUsers();
          })
          .catch(error => {
            console.error('Erro ao excluir imagem:', error);
            Swal.fire(
              'Erro!',
              'Ocorreu um erro ao excluir o imagem.',
              'error'
            );
          });
      }
    })
  }

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/imagens-dicom')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data || [])
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between"}}>
        <h4>Imagens Dicom</h4>
        <Link className="btn btn-success" to="/imagens-dicom/new">Adicionar novo</Link>
      </div>
      <div className="card animated fadeInDown mt-2">
        <table>
          <thead>
          <tr>
            <th className="col-1">ID</th>
            <th className="col-10">Titulo</th>
            <th className="col-1">Ações</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Carregando...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {imagens.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.titulo}</td>
                <td>
                  <Link className="btn btn-primary" to={'/imagens-dicom/' + u.id}>Editar</Link>
                  &nbsp;
                  <button className="btn btn-danger" onClick={ev => onDeleteClick(u)}>Excluir</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
