import {
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	Button,
	Box,
	Text,
	useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { PAGES_URLS } from '~libs/routes/highlight-extension';
import { IGetPagesRoItem, IUpdatePageRo, TGetPageRo } from '~libs/ro/highlight-extension';
import { GetPageDto, UpdatePageDto } from '~libs/dto/highlight-extension';
import { HTTPError, httpErrHandler } from '~libs/common';
import { AccordionForm, TextField, ConfirmationModal } from '~libs/react-core';
import { getPageUrl } from '~libs/client-core';

import { api } from '~/highlight-extension-fe/common/api/api';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';
import { toastDefOptions } from '~/highlight-extension-fe/common/constants/default-values/toast-options';

import IDataForPageUpdating from '../types/data-for-page-updating.interface';
import IChangePageUrlForm from '../types/change-page-url-form.interface';

export interface IPageItemProps {
	page: IGetPagesRoItem;
	onUpdatePage: (page: IUpdatePageRo) => void;
}

export default function PageItem({ page, onUpdatePage }: IPageItemProps): JSX.Element {
	const toast = useToast(toastDefOptions);
	const useFormReturnValue = useForm<IChangePageUrlForm>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	const [currentWorkspace] = useCrossExtState('currentWorkspace');
	const [, setUpdatedPages] = useCrossExtState('updatedPages');

	const [dataForPageUpdating, setDataForPageUpdating] = useState<IDataForPageUpdating | null>();

	async function onSubmit(pageId: number, { url }: IChangePageUrlForm): Promise<boolean | void> {
		const pageWithNewUrl = await checkExistingPagesWithNewURL(url);

		if (pageWithNewUrl) {
			setDataForPageUpdating({ pageId, url });
			return;
		}

		return updatePage(pageId, url);
	}

	async function checkExistingPagesWithNewURL(url: string): Promise<boolean> {
		if (!currentWorkspace) return false;

		const pageWithNewUrl = await api.get<GetPageDto, TGetPageRo>(PAGES_URLS.get, {
			workspaceId: currentWorkspace.id.toString(),
			url: getPageUrl(url),
		});
		if (pageWithNewUrl instanceof HTTPError) {
			handleErr(pageWithNewUrl);
			return false;
		}
		if (!pageWithNewUrl.id) return false;
		if ((pageWithNewUrl.id = page.id)) return false;
		return true;
	}

	async function updatePage(pageId: number, url: string): Promise<boolean | void> {
		const resp = await api.patch<UpdatePageDto, IUpdatePageRo>(PAGES_URLS.update(pageId), {
			url: getPageUrl(url),
		});
		if (resp instanceof HTTPError) {
			handleErr(resp);
			return;
		}
		onUpdatePage(resp);
		setUpdatedPages((prev) => ({
			urls: [page.url, getPageUrl(url)],
			updateTrigger: !prev.updateTrigger,
		}));
		toast({
			title: 'Page url has been successfully changed',
			status: 'success',
		});
		return true;
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof IChangePageUrlForm, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({
					title: 'Failed to update page url',
					description: msg,
				});
			},
			onUnhandledErr() {
				toast({
					title: 'Failed to update page url',
					description: 'Something went wrong. Please try again',
				});
			},
		});
	}

	async function onConfirm(): Promise<void> {
		if (!dataForPageUpdating) return;
		const { pageId, url } = dataForPageUpdating;
		await updatePage(pageId, url);
		setDataForPageUpdating(null);
	}

	return (
		<>
			<AccordionItem key={page.id}>
				<h2>
					<AccordionButton>
						<Box
							as="span"
							flex="1"
							textAlign="left"
						>
							{page.url}
						</Box>
						<AccordionIcon />
					</AccordionButton>
				</h2>
				<AccordionPanel pb={4}>
					<div>
						<AccordionForm
							useFormReturnValue={useFormReturnValue}
							onSubmitHandler={async (formValues) => {
								return await onSubmit(page.id, formValues);
							}}
							accordionButtonText={page.url}
							labelText="Update page url"
						>
							<>
								<TextField
									register={register}
									errors={errors.url}
									name="url"
									placeholder="Please enter a new page url"
									helperText="This field is intended for manual updating only if the address of the page with your highlights has been changed by the page owner"
								/>
							</>
						</AccordionForm>
					</div>
					<Text fontSize="1rem">
						<span className="options_text-highlighted">{page.highlightsCount}</span> highlights
					</Text>
					<Text fontSize="1rem">
						<span className="options_text-highlighted">{page.notesCount}</span> notes
					</Text>
					<Button
						onClick={() => window.open(page.url)}
						colorScheme="teal"
						mt={5}
					>
						Go to page
					</Button>
				</AccordionPanel>
			</AccordionItem>
			<ConfirmationModal
				isOpen={Boolean(dataForPageUpdating)}
				onConfirm={onConfirm}
				onCansel={() => setDataForPageUpdating(null)}
				header="Merge Confirmation"
				body="The page with this URL already exists. We can merge these pages together."
				confirmBtnText="Merge"
			/>
		</>
	);
}
