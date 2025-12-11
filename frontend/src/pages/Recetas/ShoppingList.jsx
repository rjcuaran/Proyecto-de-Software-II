// frontend/src/pages/ShoppingList/ShoppingList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
  Badge,
  Modal,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useSiteConfig } from "../../context/SiteConfigContext";

export default function ShoppingListPage() {
  const location = useLocation();
  const recetasSeleccionadas = location.state?.recetas || null;

  const { config } = useSiteConfig();

  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  const [generando, setGenerando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [modalExito, setModalExito] = useState(false);

  // =============================
  // CARGAR LISTA O GENERAR MULTIPLE
  // =============================
  useEffect(() => {
    if (recetasSeleccionadas && recetasSeleccionadas.length > 0) {
      generarListaMultiple();
    } else {
      cargarLista();
    }
    // eslint-disable-next-line
  }, []);

  // =============================
  // CARGAR LISTA NORMAL
  // =============================
  const cargarLista = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/shopping-list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLista(res.data.data || []);
    } catch (err) {
      console.error("❌ Error cargando lista:", err);
      setError("No se pudo cargar la lista de compras.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // GENERAR LISTA MULTIPLE
  // =============================
  const generarListaMultiple = async () => {
    try {
      setGenerando(true);
      setError(null);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/shopping-list/agregar-multiple",
        { recetas: recetasSeleccionadas },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensajeExito(res.data.message || "Lista de compras generada.");
      setModalExito(true);
      cargarLista();
    } catch (err) {
      console.error("❌ Error generando lista múltiple:", err);
      setError("No se pudo generar la lista desde las recetas seleccionadas.");
    } finally {
      setGenerando(false);
    }
  };

  // =============================
  // TOGGLE COMPRADO
  // =============================
  const toggleComprado = async (id_item) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/shopping-list/${id_item}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLista((prev) =>
        prev.map((item) =>
          item.id_item === id_item
            ? { ...item, comprado: !item.comprado }
            : item
        )
      );
    } catch (err) {
      console.error("❌ Error alternando comprado:", err);
      setError("No se pudo actualizar el estado del producto.");
    }
  };

  // =============================
  // FILTRO
  // =============================
  const listaFiltrada = lista.filter((item) => {
    if (filtro === "pendientes") return !item.comprado;
    if (filtro === "comprados") return item.comprado;
    return true;
  });

  // =============================
  // IMPRIMIR LISTA
  // =============================
  const imprimirLista = () => {
    window.print();
  };

  // =============================
  // LOADING
  // =============================
  if (generando)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" size="lg" />
        <p className="mt-3 fw-semibold fs-5">
          Generando tu lista profesional...
        </p>
      </div>
    );

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando lista de compras...</p>
      </div>
    );

  return (
    <Container className="mt-4 mb-5 shopping-wrapper">

      {/* TITULO */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1
          className="fw-bold titulo-principal m-0"
          style={{ color: "var(--color-primario)" }}
        >
          🛒 Lista de Compras
        </h1>

        {/* BOTÓN IMPRIMIR */}
        <Button
          style={{
            backgroundColor: "var(--color-primario)",
            borderColor: "var(--color-primario)",
            color: "var(--color-secundario)",
          }}
          onClick={imprimirLista}
        >
          Imprimir
        </Button>
      </div>

      {/* FILTROS */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <Button
          className="btn-dinamico"
          style={{
            backgroundColor:
              filtro === "todos"
                ? "var(--color-primario)"
                : "var(--color-secundario)",
            color:
              filtro === "todos"
                ? "var(--color-secundario)"
                : "var(--color-primario)",
            borderColor: "var(--color-primario)",
          }}
          onClick={() => setFiltro("todos")}
        >
          Todos
        </Button>

        <Button
          className="btn-dinamico"
          style={{
            backgroundColor:
              filtro === "pendientes"
                ? "var(--color-terciario)"
                : "var(--color-secundario)",
            color: "var(--color-primario)",
            borderColor: "var(--color-terciario)",
          }}
          onClick={() => setFiltro("pendientes")}
        >
          Pendientes
        </Button>

        <Button
          className="btn-dinamico"
          style={{
            backgroundColor:
              filtro === "comprados"
                ? "#28a745"
                : "var(--color-secundario)",
            color: "var(--color-primario)",
            borderColor: "#28a745",
          }}
          onClick={() => setFiltro("comprados")}
        >
          Comprados
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* LISTA */}
      {listaFiltrada.length === 0 ? (
        <p className="text-muted fs-5">No hay ingredientes en esta lista.</p>
      ) : (
        <Row className="gy-3">
          {listaFiltrada.map((item) => (
            <Col md={6} lg={4} key={item.id_item}>
              <Card
                className={`shadow-sm border-0 item-card ${
                  item.comprado ? "item-comprado" : ""
                }`}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5
                        className={`fw-semibold mb-1 nombre-ingrediente ${
                          item.comprado ? "text-decoration-line-through" : ""
                        }`}
                        style={{ color: "var(--color-primario)" }}
                      >
                        {item.nombre_ingrediente}
                      </h5>

                      <div className="small" style={{ color: "gray" }}>
                        {item.cantidad} {item.unidad_medida}
                      </div>

                      {item.comprado && (
                        <Badge bg="success" className="mt-2">
                          Comprado
                        </Badge>
                      )}
                    </div>

                    <Form.Check
                      type="checkbox"
                      checked={item.comprado}
                      onChange={() => toggleComprado(item.id_item)}
                      className="mt-1 toggle-check"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* MODAL EXITO */}
      <Modal show={modalExito} onHide={() => setModalExito(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "var(--color-primario)" }}>
            Lista Generada
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">{mensajeExito}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "var(--color-primario)",
              borderColor: "var(--color-primario)",
              color: "var(--color-secundario)",
            }}
            onClick={() => setModalExito(false)}
          >
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ESTILOS */}
      <style>{`
        .shopping-wrapper {
          max-width: 900px;
        }

        .item-card {
          border-radius: 18px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          background-color: var(--color-quinary);
        }

        .item-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 26px rgba(0,0,0,0.08);
        }

        .item-comprado {
          opacity: 0.6;
        }

        .toggle-check input {
          width: 1.2rem;
          height: 1.2rem;
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
}
