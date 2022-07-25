import { Notification } from "@/components/Elements/Notification"
import { removeOneListingNotification } from "@/slices/notification";
import { useAppDispatch, useAppSelector } from "@/stores/hook"

export const ListingNotifications = () => {
  const listingNotifications = useAppSelector((state) => state.notification.listingNotifications);
  const dispatch = useAppDispatch();

  const onDelete = (id: string) => { dispatch(removeOneListingNotification(id)) }

  return <div className="flex flex-col p-4 h-full">
    <div className="text-teal-800 text-base font-bold">Listing Notification</div>
    <div className="mt-2 grid grid-cols-1 overflow-y-auto">
      {listingNotifications.map((data, index) => <Notification key={index} {...data} onDelete={() => onDelete(data.id)} />)}
    </div>
  </div>
}