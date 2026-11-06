import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { INotification } from '../types';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import {
  Megaphone,
  CheckCheck,
  AlertTriangle,
  Clock,
  BookmarkCheck,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '' });
  const [sending, setSending] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await libraryService.markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await libraryService.markAllNotificationsRead();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSending(true);
      await libraryService.broadcastAnnouncement(broadcastForm.title, broadcastForm.message);
      setIsBroadcastOpen(false);
      setBroadcastForm({ title: '', message: '' });
      loadNotifications();
    } catch (err: any) {
      alert(err.message || 'Failed to broadcast announcement');
    } finally {
      setSending(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'OVERDUE_ALERT':
        return <AlertTriangle className="w-4 h-4 text-[#D6264C]" />;
      case 'DUE_REMINDER':
        return <Clock className="w-4 h-4 text-[#D98B16]" />;
      case 'RESERVATION_READY':
        return <BookmarkCheck className="w-4 h-4 text-[#1C8A5C]" />;
      case 'ANNOUNCEMENT':
      default:
        return <Megaphone className="w-4 h-4 text-[#4E2478]" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#1A1523] tracking-tight">
            Notifications & Announcements
          </h1>
          <p className="font-body text-xs text-[#5C5468] mt-0.5">
            System overdue alerts, reservation availability reminders, and campus-wide library notices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            icon={<CheckCheck className="w-3.5 h-3.5 text-[#4E2478]" />}
          >
            Mark All Read
          </Button>
          <Button
            size="sm"
            onClick={() => setIsBroadcastOpen(true)}
            icon={<Megaphone className="w-3.5 h-3.5" />}
          >
            Broadcast Announcement
          </Button>
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl border border-[#E3DEE9] shadow-xs divide-y divide-[#E3DEE9] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#5C5468] text-xs font-body">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-[#5C5468] text-xs font-body">No notifications present.</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start justify-between gap-3 transition-colors ${
                notif.isRead ? 'bg-white' : 'bg-[#EDE4F5]/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white border border-[#E3DEE9] shadow-xs shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold text-[#1A1523] text-xs">{notif.title}</h3>
                    {!notif.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F30137] shrink-0" />
                    )}
                    <Badge
                      variant={
                        notif.type === 'OVERDUE_ALERT'
                          ? 'danger'
                          : notif.type === 'RESERVATION_READY'
                          ? 'success'
                          : notif.type === 'ANNOUNCEMENT'
                          ? 'primary'
                          : 'info'
                      }
                    >
                      {notif.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="font-body text-xs text-[#5C5468] mt-1">{notif.message}</p>
                  <p className="font-body text-[10px] text-[#5C5468]/70 font-mono mt-1.5">
                    {new Date(notif.createdAt).toLocaleString()}
                    {notif.recipientName && ` • For: ${notif.recipientName}`}
                  </p>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="font-body text-[11px] text-[#4E2478] hover:text-[#38195A] font-medium shrink-0 pt-1"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal */}
      <Modal isOpen={isBroadcastOpen} onClose={() => setIsBroadcastOpen(false)} title="Broadcast Library Announcement">
        <form onSubmit={handleBroadcastSubmit} className="space-y-3.5 text-xs font-body">
          <Input
            label="Announcement Title"
            required
            value={broadcastForm.title}
            onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
            placeholder="e.g. Library Hours Revised During National Holidays"
          />

          <div>
            <label className="block text-[11px] font-semibold text-[#1A1523] mb-1">
              Message Content (Will be dispatched to all patrons and dashboard feeds)
            </label>
            <textarea
              className="w-full rounded-lg border border-[#E3DEE9] bg-white px-2.5 py-1.5 text-xs text-[#1A1523] focus:border-[#4E2478]"
              rows={4}
              required
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              placeholder="e.g. The central reading hall and reference library will operate on special holiday hours from 10:00 AM to 04:00 PM."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E3DEE9]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsBroadcastOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={sending} icon={<Megaphone className="w-3.5 h-3.5" />}>
              Send Announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
