import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="admin-auth">
          <h1 className="section-title">Algo salió mal</h1>
          <p>
            No pudimos cargar esta página. Si sos el administrador,
            revisá que las claves de Clerk y Supabase (.env) estén bien
            cargadas.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
