import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
//import { DicomViewer } from "./components/DicomViewer";
import DicomViewer from '../components/DicomViewer';

export default function ImagensDicomForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [imagem, setImagem] = useState({
    id: null,
    titulo: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { setNotification } = useStateContext();
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (id) {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;

      setLoading(true);
      axiosClient
        .get(`/imagens-dicom/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setImagem(data);
          setPreviewImages(data.images.map(img => `wadouri:${apiUrl}/${img.file_path}`));
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const onImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => 'wadouri:'+URL.createObjectURL(file));
    setPreviewImages(previewUrls);
    setImagem({ ...imagem, imagens: files });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setSaving(true); // começa o loading do salvar
    const formData = new FormData();
    formData.append("titulo", imagem.titulo);

    //Adicionar cada imagem ao FormData
    (imagem.imagens || []).forEach((imagem) => {
      formData.append("imagens[]", imagem);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (imagem.id) {
      
      axiosClient
        .post(`/imagens-dicom/${imagem.id}`, formData, config)
        .then((response) => { 
          setNotification("Imagem foi atualizada com sucesso");
          navigate("/imagens-dicom");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        })
        .finally(() => {
          setSaving(false); // termina o loading do salvar
        });
        
    } else {
      axiosClient
        .post("/imagens-dicom", formData, config)
        .then((response) => {
          setNotification("Imagem foi criada com sucesso");
          navigate("/imagens-dicom");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        })
        .finally(() => {
          setSaving(false); // termina o loading do salvar
        });
    }
    
  };

  return (
    <>
      {imagem.id && <h4>Atualizar Imagem: {imagem.titulo}</h4>}
      {!imagem.id && <h4>Nova imagem</h4>}
      <div className="card animated fadeInDown mt-2">
        
         {(loading || saving) && (
          <div className="text-center">
            {loading ? "Carregando..." : "Salvando, aguarde!"}
          </div>
        )}
        
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        {!loading && !saving && (
          <form onSubmit={onSubmit}>

            <div className="row">
              <div className="col-12">
                <label className="form-label">Titulo</label>
                <input className="form-control" value={imagem.titulo} onChange={(ev) => setImagem({ ...imagem, titulo: ev.target.value })} />
              </div>
            </div>

            <div className="row">
              <div className="col-10">
                <label className="form-label">Adicione imagem dicom</label>
                <input type="file" className="form-control" id="formFileMultiple" multiple onChange={onImageChange} accept=".dcm,application/dicom" />
              </div>

              <div className="col-md-2 ms-auto">
                <label className="form-label"> &ensp; </label>
                <button className="btn btn-primary w-100">Salvar</button>
              </div>
            </div>
            
            <div className="row">
              <div className="col-12">
                <div className="image-previews">
                  {previewImages.map((src, index) => (

                      <div key={index}>
                        <DicomViewer imageUrl={src} />
                      </div>

                  ))}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
