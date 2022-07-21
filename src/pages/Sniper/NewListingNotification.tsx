import { Form, InputField } from "@/components/Forms"
import { Traits } from "@/components/Views/Traits"
import * as z from 'zod';

const schema = z.object({
  priceUnder: z.number().positive()
})

type CreateListingNotificationDTO = {
  priceUnder: number
}

export const NewListingNotification = () => {
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
            console.log(values)
          }
        }
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <div className="mt-4 flex flex-col">
              <div className="flex items-end justify-center">
                <InputField label="Price Under" labelClassName="text-teal-800 text-lg" className="text-white bg-teal-800 rounded-md py-2 pr-4 border-teal-800 border text-right w-24" isRequired registration={register('priceUnder')} error={formState.errors['priceUnder']} />
                <span className="text-lg text-teal-800 ml-2">SOL</span>
              </div>
              <div className="flex items-center justify-center flex-col space-y-4 mt-4">
                <button type="button" className=" bg-gradient-to-b from-teal-700 to-teal-800 border border-teal-800 text-white py-4 px-2 rounded-lg">
                  Setup Snipe Notification
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