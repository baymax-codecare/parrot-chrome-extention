import { Notification } from "@/components/Elements/Notification"
import { removeOneFPListingNotification } from "@/slices/notification";
import { useAppDispatch, useAppSelector } from "@/stores/hook";

export const FPNotifications = () => {
  const notifications = useAppSelector((state) => state.notification.floorPriceNotifications);
  const dispatch = useAppDispatch();

  const onDelete = (id: string) => { dispatch(removeOneFPListingNotification(id)) }

  return <div className="flex flex-col p-4 h-full">
    <div className="text-teal-800 text-base font-bold">FP Notification</div>
    <div className="mt-2 grid grid-cols-1 overflow-y-auto">
      {notifications.map((data, index) => <Notification key={index} {...data} onDelete={() => onDelete(data.id)} />)}
    </div>
  </div>
}