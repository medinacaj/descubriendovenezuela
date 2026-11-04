export default function Privacy() {
  return (
    <article className="section prose">
      <h1>Privacidad de la demo</h1>
      <p>
        Esta demo local no usa publicidad, analítica ni geolocalización. La
        exploración pública no requiere una cuenta.
      </p>
      <p>
        El acceso editorial utiliza una cookie de sesión HttpOnly con caducidad
        de ocho horas. Se guardan correo, contraseña cifrada mediante hash y
        cambios editoriales en PostgreSQL local. Las sesiones pueden cerrarse
        desde el panel.
      </p>
      <p>
        No introduzcas datos personales reales en esta demostración. Antes de
        una publicación pública deben definirse responsable, canal de derechos,
        retención, eliminación y respaldo externo.
      </p>
      <p>
        Un proveedor cartográfico, si se configura, recibirá solicitudes del
        navegador conforme a sus políticas. Actualmente no hay proveedor externo
        configurado.
      </p>
    </article>
  );
}
