/** @format */

import InputText from "@/components/input/InputText";
import { UserType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";
// user
type Props = {
  register: any;
  errors: FieldErrors<UserType>;
  dtEdit: UserType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <InputText
        label={`Nama Bisnis`}
        name="profile.nm_bisnis"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.profile?.nm_bisnis}
      />
      <InputText
        label={`Nama Pemilik`}
        name="first_name"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.first_name}
      />
      <InputText
        label="Jumlah Laki-laki"
        name="profile.total_laki"
        register={register}
        required
        type="number"
        errors={errors.profile?.total_laki}
        addClass="col-span-4"
      />
      <InputText
        label="Jumlah Perempuan"
        name="profile.total_perempuan"
        register={register}
        required
        type="number"
        errors={errors.profile?.total_perempuan}
        addClass="col-span-4"
      />
      <InputText
        label={`Alamat`}
        name="profile.alamat"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.profile?.alamat}
      />
      <InputText
        label={`No Telp`}
        name="profile.tlp"
        register={register}
        addClass="lg:col-span-4 col-span-8"
        required
        errors={errors.profile?.tlp}
      />
      <InputText
        label={`Tanggal Bergabung`}
        name="profile.tgl_bergabung"
        register={register}
        addClass="lg:col-span-4 col-span-8"
        required
        type="date"
        errors={errors.profile?.tgl_bergabung}
      />

      <InputText
        label={`Deskripsi Bisnis`}
        name="profile.desc_bisnis"
        register={register}
        addClass="col-span-8"
        errors={errors.profile?.desc_bisnis}
      />

      <InputText
        label={`Username`}
        name="username"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.username}
      />
      <InputText
        label={`Email`}
        name="email"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.email}
      />
      <InputText
        label={`Password`}
        name="password"
        register={register}
        addClass="col-span-8"
        required
        type="password"
        errors={errors.password}
      />
      <InputText
        label={`Konfirmasi Password`}
        name="password_confirmation"
        register={register}
        addClass="col-span-8"
        required
        type="password"
        errors={errors.password_confirmation}
      />
    </>
  );
};

export default BodyForm;
