/** @format */

import InputText from "@/components/input/InputText";
import SelectFromDb from "@/components/select/SelectFromDB";
import useProvinsiApi from "@/stores/api/Provinsi";
import { KabupatenType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
// kabupaten
type Props = {
  register: any;
  errors: FieldErrors<KabupatenType>;
  dtEdit: KabupatenType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors, control }) => {
  const { setProvinsi, dtProvinsi } = useProvinsiApi();
  const [IsLoading, setIsLoading] = useState(false);
  // effect provinsi
  useEffect(() => {
    setIsLoading(true);
    setProvinsi();
    setIsLoading(false);
  }, [setProvinsi]);

  return (
    <>
      <InputText
        label={`Nama Kabupaten/Kota`}
        name="nm_kabupaten"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.nm_kabupaten}
      />
      {!IsLoading && dtProvinsi?.length > 0 && (
        <SelectFromDb
          name="provinsi"
          addClass={"col-span-8"}
          control={control}
          required
          errors={errors.provinsi_detail}
          body={["id", "nm_provinsi"]}
          dataDb={dtProvinsi}
          label={`Provinsi`}
          menuPosition="absolute"
          placeholder="Pilih Provinsi"
        />
      )}
    </>
  );
};

export default BodyForm;
