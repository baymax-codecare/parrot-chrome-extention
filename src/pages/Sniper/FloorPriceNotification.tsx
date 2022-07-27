import { Form, InputField, SelectField } from "@/components/Forms"
import { SOL_MAGIC_NUMBER } from "@/config";
import { addFPNotification } from "@/slices/notification";
import { useAppDispatch, useAppSelector } from "@/stores/hook";
import { nanoid } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import * as z from 'zod';

const schema = z.object({
  floorPrice: z.number({
    invalid_type_error: "Please provide correct number",
    required_error: "Value is required"
  })
    .or(z.string().regex(/\d+/, { message: "Please provide correct number" }).transform(Number))
    .refine((n) => n >= 0, { message: 'value was less than 0' }),
  isGreatOrLess: z.string().or(z.number())
})

type CreateFPNotificationDTO = {
  floorPrice: string,
  isGreatOrLess: string;
}

export const FloorPriceNotification = () => {
  const dispatch = useAppDispatch();

  const collectionSymbol = useAppSelector((state) => state.chrome.collectionSymbol)
  const collectionName = useAppSelector((state) => state.chrome.collectionName)
  const traits = useAppSelector((state) => state.chrome.traits)
  const floorPrice = useAppSelector((state) => state.chrome.floorPrice)

  const selectOptions = [
    { label: "Price Under", value: -1 },
    { label: "Price Over", value: 1 },
  ]

  return <>
    <div className="flex flex-col p-4 h-full">
      <div className="text-teal-800 text-base font-bold">Floor Price Notification</div>
      <div className="mt-2 text-teal-800">
        Get notified when the floor price of a collection reaches a specific level
      </div>
      <div className="flex-grow">

      </div>
      <Form<CreateFPNotificationDTO, typeof schema>
        onSubmit={
          async (values: CreateFPNotificationDTO) => {
            dispatch(addFPNotification({
              id: nanoid(),
              collectionName,
              collectionSymbol,
              traits,
              comparedPrice: parseFloat(values.floorPrice) * SOL_MAGIC_NUMBER,
              floorPrice,
              isGreatOrLess: values.isGreatOrLess
            }))
            toast.success("Successfully created floor price notification")
          }
        }
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <div className="mt-4 flex flex-col items-center w-full">
              <SelectField isFull={true} className="bg-teal-800 text-white mb-4 w-full" options={selectOptions} registration={register('isGreatOrLess')} error={formState.errors['isGreatOrLess']} />
              <div className="flex items-end justify-center w-full">
                <InputField className="w-full text-white bg-teal-800 rounded-md py-2 pr-4 border-teal-800 border text-right" isRequired registration={register('floorPrice')} />
                <span className="text-lg text-teal-800 ml-2">SOL</span>
              </div>
              {formState.errors['floorPrice'] && <div className="text-red-500 mt-2">{formState.errors['floorPrice'].message}</div>}
              <div className="flex items-center justify-center flex-col space-y-4 mt-4 w-full">
                <button type="submit" className="w-full bg-gradient-to-b from-teal-700 to-teal-800 border border-teal-800 text-white py-2 px-2 rounded-lg">
                  Setup FP Notification
                </button>

                <button type="reset" className="bg-white border border-white focus:border-white text-teal-800">
                  Clear
                </button>
              </div>
            </div>
          </>
        )}
      </Form>

    </div>
  </>
}