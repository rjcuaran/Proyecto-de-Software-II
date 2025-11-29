import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logoGorro from "../../assets/logo-gorro.png";
import punto from "../../assets/punto.png";
import panRebanado from "../../assets/pan-rebanado.png";
import pan from "../../assets/pan.png";
import cupcake from "../../assets/cupcake.png";
import croissant from "../../assets/croissant.png";

export default function HomePage() {

  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        background:
          "repeating-linear-gradient(90deg, #F9ECDB 0 80px, #F5DFBE 80px 160px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "40px",
        paddingBottom: "60px",
      }}
    >
      {/* CONTENEDOR GENERAL DEL HERO */}
      <div
        style={{
          width: "100%",
          maxWidth: "1920px",
          position: "relative",
        }}
      >

        {/* LOGO CENTRAL */}
        <div
          style={{
            position: "relative",
            width: "100%",
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            zIndex: 5,
          }}
        >
          <img
            src={logoGorro}
            alt="Arte Dulce Creativo"
            style={{
              width: "320px",
            }}
          />
        </div>

        {/* PAN REBANADO ARRIBA IZQUIERDA */}
        <img
          src={panRebanado}
          alt="Pan rebanado"
          style={{
            position: "absolute",
            left: "8%",
            top: "135px",
            width: "155px",
            zIndex: 2,
          }}
        />

        {/* PAN ABAJO IZQUIERDA */}
        <img
          src={pan}
          alt="Pan"
          style={{
            position: "absolute",
            left: "8%",
            top: "345px",
            width: "140px",
            zIndex: 2,
          }}
        />

        {/* CUPCAKE ARRIBA DERECHA */}
        <img
          src={cupcake}
          alt="Cupcake"
          style={{
            position: "absolute",
            right: "18%",
            top: "175px",
            width: "110px",
            zIndex: 2,
          }}
        />

        {/* CROISSANT ABAJO DERECHA */}
        <img
          src={croissant}
          alt="Croissant"
          style={{
            position: "absolute",
            right: "9%",
            top: "340px",
            width: "165px",
            zIndex: 2,
          }}
        />

        {/* PUNTOS DECORATIVOS */}
        <img
          src={punto}
          alt="Decoración"
          style={{
            position: "absolute",
            left: "27%",
            top: "210px",
            width: "26px",
            height: "26px",
            zIndex: 2,
          }}
        />

        <img
          src={punto}
          alt="Decoración"
          style={{
            position: "absolute",
            right: "26%",
            top: "285px",
            width: "26px",
            height: "26px",
            zIndex: 2,
          }}
        />

        <img
          src={punto}
          alt="Decoración"
          style={{
            position: "absolute",
            right: "7%",
            top: "305px",
            width: "22px",
            height: "22px",
            zIndex: 2,
          }}
        />

      </div>

      {/* TARJETA DE BIENVENIDA */}
      <div
        style={{
          width: "100%",
          maxWidth: "1180px",
          marginTop: "90px",
        }}
      >
        <Card
          className="shadow-lg border-0"
          style={{
            backgroundColor: "#F5DFBE",
            borderRadius: "40px",
            padding: "45px 80px",
            textAlign: "center",
            color: "#652A1C",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              marginBottom: "18px",
            }}
          >
            Bienvenido a Arte Dulce Creativo
          </h1>

          <p
            style={{
              fontSize: "1rem",
              marginBottom: "30px",
            }}
          >
            Organiza tus recetas, ingredientes, pasos y favoritos con una
            experiencia cálida, elegante y profesional.
          </p>

          {/* BOTÓN DE NAVEGACIÓN CORRECTO */}
          <button
            onClick={() => navigate("/recetas/nueva")}
            style={{
              backgroundColor: "#652A1C",
              color: "#FFC000",
              border: "none",
              padding: "12px 32px",
              borderRadius: "40px",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
              cursor: "pointer",
            }}
          >
            Comienza creando tu primera receta 💛
          </button>

        </Card>
      </div>

    </div>
  );
}
