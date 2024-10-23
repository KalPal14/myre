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

import { PAGES_FULL_URLS } from '~libs/routes/highlight-extension';
import { IGetPagesRoItem, IUpdatePageRo, TGetPageRo } from '~libs/ro/highlight-extension';
import { GetPageDto, UpdatePageDto } from '~libs/dto/highlight-extension';

import AccordionForm from '~/highlight-extension-fe/common/ui/forms/accordion-form';
import TextField from '~/highlight-extension-fe/common/ui/fields/text-field';
import ApiServise from '~/highlight-extension-fe/common/services/api.service';
import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';
import httpErrHandler from '~/highlight-extension-fe/errors/http-error/http-err-handler';
import getPageUrl from '~/highlight-extension-fe/common/helpers/get-page-url.helper';
import ConfirmationModal from '~/highlight-extension-fe/common/ui/modals/confirmation-modal';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state.hook';
import IUpdatedPagesUrlsExtState from '~/highlight-extension-fe/common/types/cross-ext-state/updated-pages-urls-ext-state.interface';

import IDataForPageUpdating from '../types/data-for-page-updating.interface';
import IChangePageUrlForm from '../types/change-page-url-form.interface';

export interface IPageItemProps {
	page: IGetPagesRoItem;
	onUpdatePage: (page: IUpdatePageRo) => void;
}

export default function PageItem({ page, onUpdatePage }: IPageItemProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<IChangePageUrlForm>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	const [, setUpdatedPages] = useCrossExtState<IUpdatedPagesUrlsExtState>('updatedPages', {
		urls: [],
	});

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
		const pageWithNewUrl = await new ApiServise().get<GetPageDto, TGetPageRo>(
			PAGES_FULL_URLS.get,
			// TODO
			{ workspaceId: '1', url: getPageUrl(url) }
		);
		if (pageWithNewUrl instanceof HTTPError) {
			handleErr(pageWithNewUrl);
			return false;
		}
		if (!pageWithNewUrl.id) return false;
		if ((pageWithNewUrl.id = page.id)) return false;
		return true;
	}

	async function updatePage(pageId: number, url: string): Promise<boolean | void> {
		const resp = await new ApiServise().patch<UpdatePageDto, IUpdatePageRo>(
			PAGES_FULL_URLS.update(pageId),
			{ url: getPageUrl(url) }
		);
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
