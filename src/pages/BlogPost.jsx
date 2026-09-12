import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";

import logo from "../assets/logo.png";
import { supabase } from "../lib/supabaseClient";
import { getPost } from "../lib/posts";
import { formatPostDate } from "../lib/formatDate";
import "../App.css";

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getPost(supabase, id)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setPost(data);
          setStatus("ready");
        } else {
          setStatus("not-found");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("not-found");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            <img
              src={logo}
              alt="MINKA Centro Comunitario"
              className="brand__logo"
            />
          </Link>
        </div>
      </header>

      <main className="blog-post">
        <div className="container blog-post__container">
          <Link to="/#informe" className="blog-post__back">
            <FaArrowLeft /> Volver al sitio
          </Link>

          {status === "loading" && (
            <p className="informe-empty">Cargando...</p>
          )}

          {status === "not-found" && (
            <div className="blog-post__empty">
              <h1 className="section-title">No encontramos este blog</h1>
              <p>Puede que haya sido eliminado o que el link esté mal.</p>
              <Link to="/" className="btn btn--primary">
                Volver al inicio
              </Link>
            </div>
          )}

          {status === "ready" && post && (
            <article>
              <span className="eyebrow eyebrow--center blog-post__eyebrow">
                {formatPostDate(post.created_at)}
              </span>
              <h1 className="blog-post__title">{post.title}</h1>
              {post.image_url && (
                <div className="blog-post__photo">
                  <img src={post.image_url} alt="" />
                </div>
              )}
              <div
                className="blog-post__body"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
              {post.pdf_url && (
                <a
                  href={post.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary blog-post__pdf"
                >
                  <FaFilePdf /> Descargar informe en PDF
                </a>
              )}
            </article>
          )}
        </div>
      </main>
    </>
  );
}

export default BlogPost;
