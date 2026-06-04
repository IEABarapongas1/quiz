import { Component } from "react";

// Captura erros de render em qualquer componente filho e exibe um fallback,
// evitando a tela em branco. Reset volta a tentar renderizar a árvore.
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Algo deu errado
          </p>
          <h1 className="mb-4 text-3xl font-extrabold">
            Ocorreu um erro inesperado
          </h1>
          <p className="mb-8 max-w-md text-base text-white/70">
            Recarregue a página ou tente novamente. Se o problema persistir,
            seus dados não foram afetados.
          </p>
          <button
            onClick={this.handleReset}
            className="rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-ink transition hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
          >
            Tentar novamente
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
