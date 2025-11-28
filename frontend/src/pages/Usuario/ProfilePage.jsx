// frontend/src/pages/Usuario/ProfilePage.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cropper from "react-easy-crop";

/* ========= Helpers para recortar imagen en el frontend ========= */

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (imageSrc, cropPixels) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo generar la imagen recortada."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.9
    );
  });
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [misRecetas, setMisRecetas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loadingRecetas, setLoadingRecetas] = useState(true);
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState(null);

  // Estado para el modal de recorte
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [rawAvatarFile, setRawAvatarFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);

  const apiBaseUrl = useMemo(
    () => process.env.REACT_APP_API_URL || "http://localhost:5000",
    []
  );

  const onCropComplete = useCallback((_, croppedAreaPixelsResult) => {
    setCroppedAreaPixels(croppedAreaPixelsResult);
  }, []);

  // Cargar perfil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiBaseUrl}/api/usuarios/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data;
        setUser(data);
        setForm({
          nombre: data?.nombre || "",
          email: data?.correo || "",
        });
      } catch (err) {
        console.error("Error cargando perfil", err);
        setError(
          err.response?.data?.message ||
            "No pudimos cargar tu perfil. Intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [apiBaseUrl]);

  // Cargar recetas del usuario
  useEffect(() => {
    const loadRecetas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiBaseUrl}/api/recetas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMisRecetas(res.data || []);
      } catch (err) {
        console.error("Error cargando recetas del usuario", err);
      } finally {
        setLoadingRecetas(false);
      }
    };

    loadRecetas();
  }, [apiBaseUrl]);

  // Cargar favoritos
  useEffect(() => {
    const loadFavoritos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiBaseUrl}/api/favoritos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavoritos(res.data?.data || []);
      } catch (err) {
        console.error("Error cargando favoritos", err);
      } finally {
        setLoadingFavoritos(false);
      }
    };

    loadFavoritos();
  }, [apiBaseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = () => {
    setError(null);
    setSuccess(null);
    setIsEditing((prev) => {
      const next = !prev;
      if (!next && user) {
        setForm({
          nombre: user.nombre || "",
          email: user.correo || "",
        });
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiBaseUrl}/api/usuarios/profile`,
        { nombre: form.nombre, email: form.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) =>
        prev
          ? {
              ...prev,
              nombre: form.nombre,
              correo: form.email,
            }
          : prev
      );

      setSuccess("Perfil actualizado exitosamente.");
      setIsEditing(false);
    } catch (err) {
      console.error("Error actualizando perfil", err);
      setError(
        err.response?.data?.message ||
          "No se pudo actualizar el perfil. Intenta nuevamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Seleccionar imagen → abrir modal de recorte
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSizeMB = 5; // ⬅ ahora 5 MB

    if (!allowedTypes.includes(file.type)) {
      setAvatarMessage(
        "Solo se permiten imágenes JPG o PNG. Por favor selecciona otra imagen."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setAvatarMessage(
        `La imagen es muy pesada. Máximo permitido: ${maxSizeMB} MB.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setRawAvatarFile(file);
    setSelectedImageUrl(objectUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setAvatarMessage(null);
    setIsCropModalOpen(true);
  };

  const resetCropState = () => {
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
    }
    setSelectedImageUrl(null);
    setRawAvatarFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsCropModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancelCrop = () => {
    resetCropState();
  };

  // Confirmar recorte → generar Blob → subir al backend
  const handleConfirmCropUpload = async () => {
    if (!selectedImageUrl || !croppedAreaPixels || !rawAvatarFile) {
      setAvatarMessage("No se pudo procesar la imagen. Intenta otra vez.");
      return;
    }

    try {
      setAvatarUploading(true);
      setAvatarMessage(null);

      const croppedBlob = await getCroppedImg(
        selectedImageUrl,
        croppedAreaPixels
      );

      const croppedFile = new File([croppedBlob], rawAvatarFile.name, {
        type: "image/jpeg",
      });

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", croppedFile);

      const res = await axios.put(
        `${apiBaseUrl}/api/usuarios/profile/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newAvatar = res.data?.avatar;

      setUser((prev) =>
        prev
          ? {
              ...prev,
              avatar: newAvatar,
            }
          : prev
      );

      setAvatarMessage("Foto de perfil actualizada correctamente.");
      resetCropState();
    } catch (err) {
      console.error("Error actualizando avatar", err);
      setAvatarMessage(
        err.response?.data?.message ||
          "No se pudo actualizar la foto de perfil. Intenta nuevamente."
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="fw-semibold">Cargando tu perfil…</span>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-4">
        <p>No se encontró la información del usuario.</p>
      </div>
    );
  }

  const inicial = user.nombre?.trim().charAt(0).toUpperCase() || "?";
  const fechaFormateada = user.fecha_registro
    ? new Date(user.fecha_registro).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const avatarUrl =
    user.avatar && user.avatar !== ""
      ? `${apiBaseUrl}/uploads/usuarios/${user.avatar}`
      : null;

  return (
    <div className="profile-page-wrapper py-4">
      <div className="container">
        {/* MODAL DE RECORTE DE AVATAR */}
        {isCropModalOpen && selectedImageUrl && (
          <div className="crop-modal-backdrop">
            <div className="crop-modal">
              <div className="crop-modal-header">
                <h5>Recortar foto de perfil</h5>
              </div>
              <div className="crop-modal-body">
                <div className="cropper-wrapper">
                  <Cropper
                    image={selectedImageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="crop-controls mt-3">
                  <label className="form-label small mb-1">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="form-range"
                  />
                  <p className="small text-muted mb-0">
                    Arrastra la imagen para centrar tu rostro o la parte que
                    quieras mostrar.
                  </p>
                </div>
              </div>
              <div className="crop-modal-footer d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleCancelCrop}
                  disabled={avatarUploading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-gourmet btn-sm"
                  onClick={handleConfirmCropUpload}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? "Guardando..." : "Guardar recorte"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HERO SUPERIOR */}
        <div className="profile-hero mb-4">
          <div className="profile-hero-content container">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="profile-avatar">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user.nombre} />
                  ) : (
                    <span>{inicial}</span>
                  )}
                </div>
                <div>
                  <p className="text-uppercase small mb-1 text-muted-cream">
                    Mi cuenta
                  </p>
                  <h1 className="h4 mb-1 text-chocolate">{user.nombre}</h1>
                  <p className="mb-0 text-muted-cream">{user.correo}</p>
                  {fechaFormateada && (
                    <p className="mb-0 text-muted-cream small">
                      Usuario desde {fechaFormateada}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-md-end d-flex flex-column align-items-md-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-gourmet-outline"
                  onClick={handleAvatarButtonClick}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? "Subiendo foto..." : "Cambiar foto"}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-gourmet"
                  onClick={handleToggleEdit}
                >
                  {isEditing ? "Cancelar edición" : "Editar perfil"}
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />

                <small className="text-muted mt-1" style={{ maxWidth: "260px" }}>
                  Formatos permitidos: JPG, PNG. Tamaño máximo: 5&nbsp;MB.
                  Puedes ajustar la imagen antes de guardar.
                </small>
              </div>
            </div>
          </div>
        </div>

        {avatarMessage && (
          <div className="container mb-3">
            <div className="alert alert-info py-2 small">{avatarMessage}</div>
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Información básica */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 bg-cream-soft">
              <div className="card-body p-4">
                <h2 className="h5 mb-3 text-chocolate">Información básica</h2>

                {error && (
                  <div className="alert alert-danger py-2 small">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success py-2 small">
                    {success}
                  </div>
                )}

                {!isEditing ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <p className="text-muted small mb-1">Nombre</p>
                      <p className="fw-semibold mb-0">{user.nombre}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="text-muted small mb-1">Correo</p>
                      <p className="fw-semibold mb-0">{user.correo}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-2">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleToggleEdit}
                        disabled={saving}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-gourmet btn-sm px-3"
                        disabled={saving}
                      >
                        {saving ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 bg-cream-soft">
              <div className="card-body p-4">
                <h2 className="h6 mb-3 text-chocolate">📊 Actividad reciente</h2>

                {loadingRecetas && loadingFavoritos ? (
                  <div>Cargando actividad...</div>
                ) : (
                  <div className="row g-3">
                    {/* Última receta creada */}
                    <div className="col-md-6">
                      <div className="activity-card">
                        <p className="text-muted small mb-1">
                          Última receta creada
                        </p>
                        {misRecetas.length > 0 ? (
                          <>
                            <p className="fw-semibold mb-1">
                              {misRecetas[misRecetas.length - 1].nombre}
                            </p>
                            <Link
                              to={`/recetas/${
                                misRecetas[misRecetas.length - 1].id_receta
                              }`}
                              className="btn btn-sm btn-dorado rounded-pill"
                            >
                              Ver receta
                            </Link>
                          </>
                        ) : (
                          <p className="text-muted small">
                            No tienes recetas.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Último favorito */}
                    <div className="col-md-6">
                      <div className="activity-card">
                        <p className="text-muted small mb-1">
                          Último favorito agregado
                        </p>
                        {favoritos.length > 0 ? (
                          <>
                            <p className="fw-semibold mb-1">
                              {favoritos[0].nombre}
                            </p>
                            <Link
                              to={`/recetas/${favoritos[0].id_receta}`}
                              className="btn btn-sm btn-outline-warning rounded-pill"
                            >
                              Ver receta ⭐
                            </Link>
                          </>
                        ) : (
                          <p className="text-muted small">
                            No has agregado favoritos.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mis Recetas */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 bg-cream-soft">
              <div className="card-body p-4">
                <h2 className="h6 mb-3 text-chocolate">👨‍🍳 Mis Recetas</h2>

                {loadingRecetas ? (
                  <p>Cargando recetas...</p>
                ) : misRecetas.length === 0 ? (
                  <p className="text-muted small">Aún no has creado recetas.</p>
                ) : (
                  <div className="row g-3">
                    {misRecetas.map((receta) => (
                      <div key={receta.id_receta} className="col-md-6">
                        <div className="recipe-card shadow-sm rounded-3">
                          <div className="recipe-img">
                            <img
                              src={`${apiBaseUrl}/uploads/recetas/${receta.imagen}`}
                              alt={receta.nombre}
                            />
                          </div>
                          <div className="recipe-content">
                            <h6 className="fw-semibold mb-1">
                              {receta.nombre}
                            </h6>
                            <p className="text-muted small mb-2">
                              {receta.categoria}
                            </p>
                            <Link
                              to={`/recetas/${receta.id_receta}`}
                              className="btn btn-sm btn-gourmet rounded-pill"
                            >
                              Ver receta
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mis Favoritos */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 bg-cream-soft">
              <div className="card-body p-4">
                <h2 className="h6 mb-3 text-chocolate">⭐ Mis Favoritos</h2>

                {loadingFavoritos ? (
                  <p>Cargando favoritos...</p>
                ) : favoritos.length === 0 ? (
                  <p className="text-muted small">
                    No tienes recetas en favoritos.
                  </p>
                ) : (
                  <div className="row g-3">
                    {favoritos.map((fav) => (
                      <div key={fav.id_receta} className="col-md-6">
                        <div className="recipe-card shadow-sm rounded-3">
                          <div className="recipe-img">
                            <img
                              src={`${apiBaseUrl}/uploads/recetas/${fav.imagen}`}
                              alt={fav.nombre}
                            />
                          </div>
                          <div className="recipe-content">
                            <h6 className="fw-semibold mb-1">{fav.nombre}</h6>
                            <p className="text-muted small mb-2">
                              {fav.categoria}
                            </p>
                            <Link
                              to={`/recetas/${fav.id_receta}`}
                              className="btn btn-sm btn-dorado rounded-pill"
                            >
                              Ver receta ⭐
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estilos específicos para la página de perfil con paleta gourmet */}
        <style>
          {`
  .profile-page-wrapper {
    background-color: #F9ECDB;
    min-height: 100vh;
    padding-top: 20px;
  }

  .profile-hero {
    border-radius: 20px;
    background: linear-gradient(135deg, #FCEED9, #F9E4C6);
    border: 1px solid rgba(101, 42, 28, 0.15);
  }

  .profile-hero-content {
    padding: 24px 32px;
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #FCEED9;
    border: 3px solid #FFC000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.6rem;
    color: #652A1C;
    overflow: hidden;
  }

  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .text-chocolate {
    color: #652A1C;
  }

  .text-muted-cream {
    color: #8a624b;
  }

  .bg-cream-soft {
    background-color: #FCEED9;
  }

  .activity-card {
    background: #FCEED9;
    border: 1px solid rgba(101, 42, 28, 0.1);
    padding: 12px;
    border-radius: 12px;
  }

  .recipe-card {
    background: #FCEED9;
    border: 1px solid rgba(101, 42, 28, 0.1);
    overflow: hidden;
    display: flex;
  }

  .recipe-img img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-right: 1px solid rgba(101, 42, 28, 0.1);
  }

  .recipe-content {
    padding: 10px;
    flex: 1;
  }

  .btn-gourmet {
    background-color: #652A1C;
    color: #F9ECDB;
    border-radius: 999px;
    border: none;
  }

  .btn-gourmet:hover {
    background-color: #4a2016;
    color: #F9ECDB;
  }

  .btn-gourmet-outline {
    background-color: transparent;
    color: #652A1C;
    border-radius: 999px;
    border: 1px solid #652A1C;
  }

  .btn-gourmet-outline:hover {
    background-color: #652A1C;
    color: #F9ECDB;
  }

  .btn-dorado {
    background-color: #FFC000;
    color: #652A1C;
    border-radius: 999px;
    border: none;
  }

  .btn-dorado:hover {
    background-color: #e6ab00;
    color: #652A1C;
  }

  /* Modal de recorte */
  .crop-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
  }

  .crop-modal {
    background-color: #FFFFFF;
    border-radius: 18px;
    max-width: 520px;
    width: 90%;
    padding: 18px 20px 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    border: 2px solid #F5DFBE;
  }

  .crop-modal-header h5 {
    margin: 0;
    color: #652A1C;
  }

  .cropper-wrapper {
    position: relative;
    width: 100%;
    height: 320px;
    background: #000;
    border-radius: 16px;
    overflow: hidden;
  }
`}
        </style>
      </div>
    </div>
  );
}
