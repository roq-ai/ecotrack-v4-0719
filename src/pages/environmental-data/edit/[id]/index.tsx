import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getEnvironmentalDataById, updateEnvironmentalDataById } from 'apiSdk/environmental-data';
import { Error } from 'components/error';
import { environmentalDataValidationSchema } from 'validationSchema/environmental-data';
import { EnvironmentalDataInterface } from 'interfaces/environmental-data';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';

function EnvironmentalDataEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EnvironmentalDataInterface>(
    () => (id ? `/environmental-data/${id}` : null),
    () => getEnvironmentalDataById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EnvironmentalDataInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEnvironmentalDataById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EnvironmentalDataInterface>({
    initialValues: data,
    validationSchema: environmentalDataValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Environmental Data
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="carbon_footprint" mb="4" isInvalid={!!formik.errors?.carbon_footprint}>
              <FormLabel>Carbon Footprint</FormLabel>
              <NumberInput
                name="carbon_footprint"
                value={formik.values?.carbon_footprint}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('carbon_footprint', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.carbon_footprint && <FormErrorMessage>{formik.errors?.carbon_footprint}</FormErrorMessage>}
            </FormControl>
            <FormControl id="waste_production" mb="4" isInvalid={!!formik.errors?.waste_production}>
              <FormLabel>Waste Production</FormLabel>
              <NumberInput
                name="waste_production"
                value={formik.values?.waste_production}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('waste_production', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.waste_production && <FormErrorMessage>{formik.errors?.waste_production}</FormErrorMessage>}
            </FormControl>
            <FormControl id="sustainable_practices" mb="4" isInvalid={!!formik.errors?.sustainable_practices}>
              <FormLabel>Sustainable Practices</FormLabel>
              <NumberInput
                name="sustainable_practices"
                value={formik.values?.sustainable_practices}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('sustainable_practices', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.sustainable_practices && (
                <FormErrorMessage>{formik.errors?.sustainable_practices}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="created_at" mb="4">
              <FormLabel>Created At</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.created_at}
                onChange={(value: Date) => formik.setFieldValue('created_at', value)}
              />
            </FormControl>
            <FormControl id="updated_at" mb="4">
              <FormLabel>Updated At</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.updated_at}
                onChange={(value: Date) => formik.setFieldValue('updated_at', value)}
              />
            </FormControl>
            <AsyncSelect<BusinessOrganizationInterface>
              formik={formik}
              name={'business_organization_id'}
              label={'Select Business Organization'}
              placeholder={'Select Business Organization'}
              fetcher={getBusinessOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'environmental_data',
  operation: AccessOperationEnum.UPDATE,
})(EnvironmentalDataEditPage);
