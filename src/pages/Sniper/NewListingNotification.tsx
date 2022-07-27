import { Form, InputField } from "@/components/Forms"
import { Traits } from "@/components/Views/Traits"
import { SOL_MAGIC_NUMBER } from "@/config";
import { addListingNotification } from "@/slices/notification";
import { useAppDispatch, useAppSelector } from "@/stores/hook";
import { nanoid } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import * as z from 'zod';

const schema = z.object({
  priceUnder: z
    .number({
      invalid_type_error: "Please provide correct number",
      required_error: "Value is required"
    })
    .or(z.string().regex(/\d+/, { message: "Please provide correct number" }).transform(Number))
    .refine((n) => n >= 0, { message: 'value was less than 0' })
})

type CreateListingNotificationDTO = {
  priceUnder: string
}

export const NewListingNotification = () => {
  const dispatch = useAppDispatch();

  const collectionSymbol = useAppSelector((state) => state.chrome.collectionSymbol)
  const collectionName = useAppSelector((state) => state.chrome.collectionName)
  const traits = useAppSelector((state) => state.chrome.traits)
  const floorPrice = useAppSelector((state) => state.chrome.floorPrice)

  return <>
    <div className="flex flex-col p-4 h-full">
      <div className="text-teal-800 text-base font-bold">New Listing Notification</div>
      <div className="mt-2">
        <Traits />
      </div>
      <div className="flex-grow">

      </div>
      <Form<CreateListingNotificationDTO, typeof schema>
        onSubmit={
          async (values: CreateListingNotificationDTO) => {
            dispatch(addListingNotification({
              id: nanoid(),
              collectionSymbol,
              collectionName,
              traits,
              comparedPrice: parseFloat(values.priceUnder) * SOL_MAGIC_NUMBER,
              floorPrice,
            }))
            toast.success("Successfully created listing notification")
          }
        }
        schema={schema}
      >
        {({ register, formState }) => {
          return (
            <>
              <div className="mt-4 flex flex-col">
                <div className="flex items-end w-full">
                  <InputField label="Price Under" labelClassName="text-teal-800 text-lg" className="w-full text-white bg-teal-800 rounded-md py-2 pr-4 border-teal-800 border text-right" isRequired registration={register('priceUnder')} />
                  <span className="text-lg text-teal-800 ml-2">SOL</span>
                </div>
                {formState.errors['priceUnder'] && <div className="text-red-500 mt-2">{formState.errors['priceUnder'].message}</div>}
                <div className="h-[50px]"></div>
                <div className="flex items-center justify-center flex-col space-y-4 mt-4 w-full">
                  <button type="submit" className="w-full bg-gradient-to-b from-teal-700 to-teal-800 border border-teal-800 text-white py-2 px-2 rounded-lg">
                    Setup Snipe Notification
                  </button>

                  <button type="reset" className="bg-white border border-white focus:border-white text-teal-800">
                    Clear
                  </button>
                </div>
              </div>
            </>
          )
        }}
      </Form>

    </div>
  </>
}