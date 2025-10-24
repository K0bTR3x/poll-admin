import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getMeetings, deleteMeeting } from "../../services/meetingService";
import MeetingHeader from "./components/MeetingHeader";
import MeetingTable from "./components/MeetingTable";
import "./Meetings.scss";
import { DeleteConfirm } from "./components/DeleteConfirm";
const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortableList, setSortableList] = useState([]);
  const [filterableList, setFilterableList] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
  });

  // 🔹 Backenddən Meeting-ləri gətiririk
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await getMeetings({
        page: pagination.currentPage,
        perPage: pagination.perPage,
      });

      // Backend cavabı strukturuna uyğun desctructure
      const { data, meta, sortable, filters } = res.data;
      setMeetings(data || []);
      setMeta(meta || {});
      setSortableList(sortable || []);
      setFilterableList(filters || []);
    } catch (err) {
      console.error("Xəta:", err);
      toast.error("Meeting məlumatları yüklənmədi!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = await DeleteConfirm(`"${title}" adlı meeting silinsin?`);
    if (!confirmed) return;
    try {
      await deleteMeeting(id);
      toast.success(`"${title}" silindi.`);
      fetchMeetings();
    } catch (err) {
      toast.error("Silmə zamanı xəta baş verdi!");
    }
  };

  // 🔹 Pagination dəyişəndə Meeting-ləri yenilə
  useEffect(() => {
    fetchMeetings();
  }, [pagination.currentPage, pagination.perPage]);

  return (
    <div className="meetings-page">
      <Toaster position="top-right" />
      {/* 🔹 Header hissəsi */}
      <MeetingHeader pagination={pagination} setPagination={setPagination} />

      {/* 🔹 Table hissəsi */}
      <MeetingTable
        meetings={meetings}
        meta={meta}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        onDelete={handleDelete}
        sortableList={sortableList}
        filterableList={filterableList}
      />

    </div>
  );
};

export default Meetings;
