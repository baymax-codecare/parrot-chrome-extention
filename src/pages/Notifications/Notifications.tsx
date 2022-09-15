import { FPNotifications } from "./FPNotifications"
import { ListingNotifications } from "./ListingNotifications"
import * as z from 'zod';
import { Form, SelectField } from "@/components/Forms";
import { ReactComponent as DiscordSVG } from '@/assets/images/discord-icon.svg';
import { ReactComponent as TwitterSVG } from '@/assets/images/twitter.svg'
import { useAppDispatch, useAppSelector } from "@/stores/hook";
import { removeAllNotifications } from "@/slices/notification";
import { SENDER } from "@/chrome/types";
import { MESSAGE_SET_REFRESH_INTERVAL } from "@/chrome/consts";
import toast from "react-hot-toast";
import { setRefreshInterval } from "@/slices/chrome";
import { sendRefreshIntervalRequest } from "@/services/server";


const schema = z.object({
  interval: z.number({
    invalid_type_error: "Please provide correct number",
    required_error: "Value is required"
  })
    .or(z.string().regex(/\d+/, { message: "Please provide correct number" }).transform(Number))
    .refine((n) => n >= 0, { message: 'value was less than 0' }),
})

type ChangeRefreshIntervalDTO = {
  interval: string;
}

export const Notifications = () => {

  const dispatch = useAppDispatch();
  const handleDeleteAll = () => {
    dispatch(removeAllNotifications());
  }

  const defaultRefreshInterval = useAppSelector((state) => state.chrome.refreshInterval);

  const selectOptions = [
    { label: "1 Min", value: 1 },
    { label: "5 Min", value: 5 },
    { label: "10 Min", value: 10 },
    { label: "20 Min", value: 20 },
    { label: "30 Min", value: 30 },
    { label: "1 Hrs", value: 60 },
    { label: "2 Hrs", value: 60 * 2 },
    { label: "3 Hrs", value: 60 * 3 },
    { label: "6 Hrs", value: 60 * 6 },
    { label: "12 Hrs", value: 60 * 12 },
    { label: "24 Hrs", value: 60 * 24 },
    { label: "48 Hrs", value: 60 * 48 },
  ]

  return <div className="flex flex-col flex-1 min-h-0">
    <div className="flex-1 grid grid-cols-2 divide-x divide-teal-800 min-h-0">
      <div className="flex-1 min-h-0">
        <ListingNotifications />
      </div>
      <div className="flex-1 min-h-0">
        <FPNotifications />
      </div>
    </div>
    <div className="flex flex-col">
      <div className="text-teal-800 font-bold text-base text-center">Change Refresh Interval</div>
      <Form<ChangeRefreshIntervalDTO, typeof schema>
        onSubmit={
          async (values: ChangeRefreshIntervalDTO) => {
            chrome.runtime.sendMessage({
              from: SENDER.React,
              type: MESSAGE_SET_REFRESH_INTERVAL,
              message: values.interval
            });
            dispatch(setRefreshInterval(values.interval))
            sendRefreshIntervalRequest({ refreshInterval: Number(values.interval) })
            toast.success("Successfully updated refresh interval");
          }
        }
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <div className="mt-2 flex flex-col items-center">
              <SelectField className="bg-teal-800 text-white mb-4 w-[135px]" options={selectOptions} registration={register('interval')} error={formState.errors['interval']} defaultValue={defaultRefreshInterval} />
              <div className="flex items-center justify-center flex-col space-y-2">
                <button type="submit" className="w-[135px] bg-gradient-to-b from-teal-700 to-teal-800 border border-teal-800 text-white py-2 px-2 rounded-lg">
                  Submit
                </button>

                <button type="reset" className="bg-white border border-white focus:border-white text-teal-800" onClick={handleDeleteAll}>
                  Delete All
                </button>

                <div className="flex items-center justify-center space-x-2">
                  <a target="_blank" href="http://discord.gg/parrotflock" className="flex items-center bg-white border border-white focus:border-white text-teal-800" rel="noreferrer">
                    <DiscordSVG className="text-teal-800 w-8 h-8 fill-current mr-2" />
                    Join Our Discord
                  </a>
                  <a href="https://twitter.com/parrottools" target="_blank" className="flex items-center bg-white border border-white focus:border-white text-teal-800" rel="noreferrer">
                    <TwitterSVG className="text-teal-800 w-8 h-8 fill-current mr-2" />
                    Follow us on Twitter
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </Form>
    </div>
  </div>
}