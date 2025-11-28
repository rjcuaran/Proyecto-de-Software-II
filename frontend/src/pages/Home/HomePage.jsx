import React from "react";
import { Card } from "react-bootstrap";

export default function HomePage() {
  return (
    <div
      className="container mt-5"
      style={{
        background: "#F9ECDB",
        padding: "40px",
        borderRadius: "20px",
      }}
    >
      <Card
        className="p-5 shadow-lg border-0"
        style={{
          background: "#F5DFBE",
          borderRadius: "20px",
        }}
      >
        <h1
          className="text-center fw-bold"
          style={{ color: "#652A1C", fontSize: "2.2rem" }}
        >
          🍰 Bienvenido a Arte Dulce Creativo
        </h1>

        <p
          className="text-center mt-3"
          style={{ color: "#652A1C", fontSize: "1.1rem" }}
        >
          Organiza tus recetas, ingredientes, pasos y favoritos con una
          experiencia cálida, elegante y profesional.
        </p>

        <div className="text-center mt-4">
          <span
            style={{
              background: "#FFC000",
              color: "#652A1C",
              padding: "10px 25px",
              borderRadius: "40px",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          >
            Comienza creando tu primera receta 💛
          </span>
        </div>
      </Card>
    </div>
  );
}
