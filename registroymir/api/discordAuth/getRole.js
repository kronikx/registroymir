fetch("/api/getRole")
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log("Tu rol:", data.rol);
      console.log("Tu userId:", data.userId);
      // aquí ya puedes decidir qué mostrar
    } else {
      alert("Sesión expirada o usuario no encontrado");
      window.location.href = "/index.html";
    }
  });
