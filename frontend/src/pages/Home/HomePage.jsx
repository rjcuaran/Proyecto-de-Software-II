import React from "react";
import { Card } from "react-bootstrap";

export default function HomePage() {
  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-lg border-0">
        <h2 className="text-center text-primary fw-bold">Bienvenido al Organizador de Recetas</h2>
        <p className="text-center mt-3 text-muted">
          Administra tus recetas, ingredientes, favoritos y lista de compras de forma sencilla.
        </p>
      </Card>
    </div>
  );
}
