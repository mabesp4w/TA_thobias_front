/** @format */

import InputText from "@/components/input/InputText";
import SelectFromDb from "@/components/select/SelectFromDB";
import useKabupatenApi from "@/stores/api/Kabupaten";
import { KecamatanType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
// kecamatan
type Props = {
  register: any;
  errors: FieldErrors<KecamatanType>;
  dtEdit: KecamatanType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors, control }) => {
  const { setKabupaten, dtKabupaten } = useKabupatenApi();
  const [IsLoading, setIsLoading] = useState(false);
  // effect kabupaten
  useEffect(() => {
    setIsLoading(true);
    setKabupaten();
    setIsLoading(false);
  }, [setKabupaten]);
  console.log({ dtKabupaten });
  return (
    <>
      <InputText
        label={`Nama Distrik`}
        name="nm_kecamatan"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.nm_kecamatan}
      />
      {!IsLoading && dtKabupaten?.length > 0 && (
        <SelectFromDb
          name="kabupaten"
          addClass={"col-span-8"}
          control={control}
          required
          errors={errors.kabupaten_detail}
          body={["id", "provinsi.nm_provinsi", "nm_kabupaten"]}
          dataDb={dtKabupaten}
          label={`Kabupaten`}
          menuPosition="absolute"
          placeholder="Pilih Kabupaten"
        />
      )}
    </>
  );
};

export default BodyForm;
