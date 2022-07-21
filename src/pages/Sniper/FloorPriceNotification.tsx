import { Form, InputField, SelectField } from "@/components/Forms"
import { Traits } from "@/components/Views/Traits"
import * as z from 'zod';

const schema = z.object({
  floorPrice: z.number().positive(),
  isUpOrDown: z.string()
})

type CreateFPNotificationDTO = {
  floorPrice: number,
  isOverOrUnder: string;
}

export const FloorPriceNotification = () => {

  const selectOptions = [
    { label: "Price Over", value: "over" },
    { label: "Price Under", value: "under" }
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
            console.log(values)
          }
        }
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <div className="mt-4 flex flex-col items-center">
              <SelectField className="bg-teal-800 text-white mb-4 w-[135px]" options={selectOptions} registration={register('isOverOrUnder')} error={formState.errors['isOverOrUnder']} />
              <div className="flex items-center justify-center w-[135px]">
                <InputField className="text-white bg-teal-800 rounded-md py-2 pr-4 border-teal-800 border text-right w-24" isRequired registration={register('floorPrice')} error={formState.errors['floorPrice']} />
                <span className="text-lg text-teal-800 ml-2">SOL</span>
              </div>
              <div className="flex items-center justify-center flex-col space-y-4 mt-4">
                <button type="button" className="w-[135px] bg-gradient-to-b from-teal-700 to-teal-800 border border-teal-800 text-white py-4 px-2 rounded-lg">
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