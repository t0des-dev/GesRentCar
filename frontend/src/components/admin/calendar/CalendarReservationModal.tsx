"use client";

import { X, User, Clock, FileText } from "lucide-react";
import styles from "../../../app/admin/calendar/page.module.css";

interface CalendarReservationModalProps {
  reservation: any;
  onClose: () => void;
  apiUrl: string;
}

export default function CalendarReservationModal({ reservation, onClose, apiUrl }: CalendarReservationModalProps) {
  if (!reservation) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <div className={`${styles.resStatusBadge} ${styles[reservation.status]}`}>
            #{reservation.id} - {reservation.status.toUpperCase()}
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </header>

        <div className={styles.modalContent}>
          <div className={styles.detailItem}>
            <User size={18} color="#6366f1" />
            <div><label>Client</label><strong>{reservation.client_name}</strong></div>
          </div>
          <div className={styles.detailItem}>
            <Clock size={18} color="#6366f1" />
            <div><label>Période de location</label><strong>Du {new Date(reservation.start_date).toLocaleDateString('fr-FR')} au {new Date(reservation.end_date).toLocaleDateString('fr-FR')}</strong></div>
          </div>
          <div className={styles.detailItem}>
            <FileText size={18} color="#6366f1" />
            <div>
              <label>Documents</label>
              <a href={`${apiUrl}/contracts/${reservation.id}/pdf?lang=fr&token=${localStorage.getItem('auth_token')}`} target="_blank" className={styles.pdfLink}>
                Télécharger le Contrat (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
