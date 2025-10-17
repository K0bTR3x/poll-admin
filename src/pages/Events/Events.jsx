import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";
import "./Events.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { BsQuestionSquare } from "react-icons/bs";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const eventsPerPage = 5;

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError("Tədbirləri yükləmək mümkün olmadı!");
        setLoading(false);
      }
    };
    fetchEvents();
  }, [API_URL]);

  const filteredEvents = events.filter((e) =>
    e.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id) => {
    const event = events.find((e) => e.id === id);
    Swal.fire({
      title: "Silinsin?",
      text: `"${event.title}" tədbirini silmək istədiyinizə əminsiniz?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/events/${id}`);
          setEvents(events.filter((e) => e.id !== id));
          Swal.fire("Silindi!", `"${event.title}" silindi.`, "success");
        } catch (err) {
          Swal.fire("Xəta!", "Silmə zamanı problem baş verdi.", "error");
        }
      }
    });
  };

  if (loading) {
    return <div className="loading">Yüklənir...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h2 className="events-title">Tədbirlər</h2>
        <div className="events-actions">
          <input
            type="text"
            placeholder="Axtar..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          <Link to="/events/create" className="create-btn">
            <FiPlus /> Yeni Tədbir
          </Link>
        </div>
      </div>

      <div className="events-table">
        <div className="table-header">
          <div>Adı</div>
          <div>Tarix</div>
          <div>Status</div>
          <div>Əməliyyatlar</div>
        </div>

        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <div className="table-row" key={event.id}>
              <div>{event.title}</div>
              <div>{new Date(event.date).toLocaleDateString()}</div>
              <div>
                <span className={`status ${event.status}`}>
                  {event.status}
                </span>
              </div>
              <div className="actions">
                <button className="view">
                  <FiEye />
                </button>
                <button className="edit">
                  <FiEdit />
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(event.id)}
                >
                  <FiTrash2 />
                </button>
                <button
                  className="questions"
                >
                  <BsQuestionSquare />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">Heç bir tədbir tapılmadı.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={currentPage === idx + 1 ? "active" : ""}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
