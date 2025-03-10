import { useMemo } from "react";
import {
	FileVirusTotalResponse,
	SignatureInfo,
	X509Item,
	FileVirusTotalAttributes,
	PEInfo,
	PEResourceDetais,
	PESection,
	BundleInfo,
	PEOverlay,
} from "../../../../../../types/AnalysisTypes/analysisResultsTypes";
import { convertTimestamp } from "../../../../../../utils/convertTimestamp";
import { formatBytes } from "../../../../../../utils/formatBytes";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

// Константы для классов
const CLASS_NAMES = {
	CONTAINER: "details-cont",
	ITEM: "details-item",
	DESC: "details-desc",
	TITLE: "details-desc-title",
	TABLE: "details-table",
	NO_DATA: "analysis-no-data",
} as const;

// Типизация
interface FileDetailsProps {
	fileAnalysisResults: FileVirusTotalResponse | null;
}

interface DetailsTableProps<T extends object> {
	title: string;
	headers: string[];
	data: T[];
	columns?: (keyof T)[];
}

// Утилита для рендеринга ключ-значение
const renderDetail = (label: string, value?: string | number) => (
	value && (
		<li className={CLASS_NAMES.DESC}>
			<strong>{label}</strong>
			<span>{value}</span>
		</li>
	)
);

// Компонент для списков ключ-значение
const KeyValueList = ({
	title,
	data,
}: {
	title: string;
	data: Record<string, string | number> | string[] | PEOverlay;
}) => (
	<ul className={CLASS_NAMES.CONTAINER}>
		<li className={CLASS_NAMES.TITLE}>{title}</li>
		{Array.isArray(data) ? (
			data.map((item, index) => (
				<li key={index} className={CLASS_NAMES.DESC}>{item}</li>
			))
		) : (
			Object.entries(data).map(([key, value]) => (
				<li key={key} className={CLASS_NAMES.DESC}>
					<span>{key}:</span> <span>{value}</span>
				</li>
			))
		)}
	</ul>
);

// Компонент для таблиц без лишнего ограничения
const DetailsTable = <T extends object>({
	title,
	headers,
	data,
	columns,
}: DetailsTableProps<T>) => (
	<ul className={CLASS_NAMES.CONTAINER}>
		<li className={CLASS_NAMES.TITLE}>{title}</li>
		<li className={CLASS_NAMES.ITEM}>
			<table className={CLASS_NAMES.TABLE}>
				<thead>
					<tr>{headers.map((header, i) => <th key={i}>{header}</th>)}</tr>
				</thead>
				<tbody>
					{data.map((row, index) => (
						<tr key={index}>
							{columns
								? columns.map((col) => (
									<td key={String(col)}>{String(row[col] ?? "")}</td>
								))
								: Object.values(row).map((value, i) => (
									<td key={i}>{String(value ?? "")}</td>
								))}
						</tr>
					))}
				</tbody>
			</table>
		</li>
	</ul>
);

// Трансформаторы данных
const transformX509Item = (serverItem: Partial<X509Item>): X509Item => ({
	algorithm: serverItem.algorithm || "",
	"cert issuer": serverItem["cert issuer"] || "",
	name: serverItem.name || "",
	"serial number": serverItem["serial number"] || "",
	thumbprint: serverItem.thumbprint || "",
	thumbprint_md5: serverItem.thumbprint_md5 || "",
	thumbprint_sha256: serverItem.thumbprint_sha256 || "",
	"valid from": serverItem["valid from"] || "",
	"valid to": serverItem["valid to"] || "",
});

const transformSignatureInfo = (
	serverData: Partial<SignatureInfo>
): SignatureInfo => ({
	verified: serverData.verified || "",
	copyright: serverData.copyright || "",
	comments: serverData.comments || "",
	product: serverData.product || "",
	description: serverData.description || "",
	"original name": serverData["original name"] || "",
	"internal name": serverData["internal name"] || "",
	"file version": serverData["file version"] || "",
	"signing date": serverData["signing date"] || "",
	signers: serverData.signers || "",
	"counter signers": serverData["counter signers"] || "",
	x509: serverData.x509?.map(transformX509Item),
});

// Подкомпоненты
const MainProperties = ({
	attributes,
	t,
}: {
	attributes: FileVirusTotalAttributes;
	t: TFunction;
}) => (
	<li className={CLASS_NAMES.ITEM}>
		<h1>{t("analysisPage.analyzedData.details.file.properties")}</h1>
		<ul className={CLASS_NAMES.CONTAINER}>
			{renderDetail("MD5", attributes?.md5)}
			{renderDetail("SHA-1", attributes?.sha1)}
			{renderDetail("SHA-256", attributes?.sha256)}
			{renderDetail("Vhash", attributes?.vhash)}
			{renderDetail("Authentihash", attributes?.authentihash)}
			{renderDetail("Imphash", attributes?.pe_info?.imphash)}
			{renderDetail("Rich PE header hash", attributes?.pe_info?.rich_pe_header_hash)}
			{renderDetail("SSDEEP", attributes?.ssdeep)}
			{renderDetail("TLSH", attributes?.tlsh)}
			{renderDetail("File type", attributes?.type_description)}
			{renderDetail("Magic", attributes?.magic)}
			{attributes?.trid?.length > 0 && (
				<li className={CLASS_NAMES.DESC}>
					<strong>TrID</strong>
					<span>
						{attributes.trid.map((value, index) => (
							<span key={index} className={CLASS_NAMES.DESC}>
								{value.file_type}
							</span>
						))}
					</span>
				</li>
			)}
			{renderDetail("Magika", attributes?.magika)}
			{renderDetail("File size", attributes?.size && formatBytes(attributes.size))}
		</ul>
	</li>
);

const HistorySection = ({
	attributes,
	t,
}: {
	attributes: FileVirusTotalAttributes;
	t: TFunction;
}) => (
	attributes?.first_submission_date && (
		<li className={CLASS_NAMES.ITEM}>
			<h1>{t("analysisPage.analyzedData.details.file.history")}</h1>
			<ul className={CLASS_NAMES.CONTAINER}>
				{renderDetail(
					t("analysisPage.analyzedData.details.file.creationTime"),
					attributes?.creation_date && convertTimestamp(attributes.creation_date)
				)}
				{renderDetail(
					t("analysisPage.analyzedData.details.file.firstSubmition"),
					attributes?.first_submission_date &&
					convertTimestamp(attributes.first_submission_date)
				)}
				{renderDetail(
					t("analysisPage.analyzedData.details.file.lastSubmission"),
					attributes?.last_submission_date &&
					convertTimestamp(attributes.last_submission_date)
				)}
				{renderDetail(
					t("analysisPage.analyzedData.details.file.lastAnalysis"),
					attributes?.last_analysis_date &&
					convertTimestamp(attributes.last_analysis_date)
				)}
			</ul>
		</li>
	)
);

const NamesSection = ({
	names,
	t,
}: {
	names: string[];
	t: TFunction;
}) => (
	<li className={CLASS_NAMES.ITEM}>
		<h1>{t("analysisPage.analyzedData.details.file.names")}</h1>
		<ul className={CLASS_NAMES.CONTAINER}>
			{names.map((name) => (
				<li key={name} className={CLASS_NAMES.DESC}>{name}</li>
			))}
		</ul>
	</li>
);

const SignatureSection = ({
	signatureInfo,
	t,
}: {
	signatureInfo: SignatureInfo | null;
	t: TFunction;
}) => (
	signatureInfo && Object.keys(signatureInfo).length > 0 && (
		<li className={CLASS_NAMES.ITEM}>
			<h1>{t("analysisPage.analyzedData.details.file.signatureInfo")}</h1>
			<ul className={CLASS_NAMES.CONTAINER}>
				<li className={CLASS_NAMES.DESC}>
					<strong>{t("analysisPage.analyzedData.details.file.verification")}</strong>
					<span>
						{signatureInfo.verified ? "Signed file, valid signature" : "File is not signed"}
					</span>
				</li>
			</ul>
			{Object.keys(signatureInfo).length > 0 && (
				<ul className={CLASS_NAMES.CONTAINER}>
					<li className={CLASS_NAMES.TITLE}>
						{t("analysisPage.analyzedData.details.file.fileVersion")}
					</li>
					{renderDetail(
						t("analysisPage.analyzedData.details.file.fileVersionCopyright"),
						signatureInfo.copyright
					)}
					{renderDetail(
						t("analysisPage.analyzedData.details.file.fileVersionProduct"),
						signatureInfo.product
					)}
					{renderDetail(
						t("analysisPage.analyzedData.details.file.fileVersionDescription"),
						signatureInfo.description
					)}
					{renderDetail(
						t("analysisPage.analyzedData.details.file.fileVersionOriginalName"),
						signatureInfo["original name"]
					)}
					{renderDetail(
						t("analysisPage.analyzedData.details.file.fileVersionInternalName"),
						signatureInfo["internal name"]
					)}
					{renderDetail(
						t("analysisPage.analyzedData.details.file.fileVersionFileVersion"),
						signatureInfo["file version"]
					)}
					{renderDetail(
						t("analysisPage.analyzedData.details.file.fileVersionDateSigned"),
						signatureInfo["signing date"]
					)}
					{renderDetail(
						t("analysisPage.analyzedData.details.file.fileVersionDateComments"),
						signatureInfo.comments
					)}
				</ul>
			)}
			{signatureInfo.signers && (
				<KeyValueList
					title={t("analysisPage.analyzedData.details.file.signers")}
					data={signatureInfo.signers.split(";").map((s: string) => s.trim())}
				/>
			)}
			{signatureInfo["counter signers"] && (
				<KeyValueList
					title={t("analysisPage.analyzedData.details.file.counterSigners")}
					data={signatureInfo["counter signers"].split(";").map((s: string) => s.trim())}
				/>
			)}
			{signatureInfo.x509 && signatureInfo.x509?.length > 0 && (
				<KeyValueList
					title={t("analysisPage.analyzedData.details.file.x509")}
					data={signatureInfo.x509.map((cert) => cert["cert issuer"])}
				/>
			)}
		</li>
	)
);

const PeInfoSection = ({
	peInfo,
	t,
}: {
	peInfo: PEInfo | undefined;
	t: TFunction;
}) => (
	peInfo && Object.keys(peInfo).length > 0 && (
		<li className={CLASS_NAMES.ITEM}>
			<h1>{t("analysisPage.analyzedData.details.file.portableExecutableInfo")}</h1>
			{peInfo.compiler_product_versions && (
				<KeyValueList
					title={t("analysisPage.analyzedData.details.file.compilerProducts")}
					data={peInfo.compiler_product_versions}
				/>
			)}
			{peInfo.timestamp && (
				<ul className={CLASS_NAMES.CONTAINER}>
					<li className={CLASS_NAMES.TITLE}>
						{t("analysisPage.analyzedData.details.file.header")}
					</li>
					{renderDetail(
						t("analysisPage.analyzedData.details.file.timestamp"),
						convertTimestamp(peInfo.timestamp)
					)}
					{renderDetail(
						t("analysisPage.analyzedData.details.file.entryPoint"),
						peInfo.entry_point
					)}
					{renderDetail(
						t("analysisPage.analyzedData.details.file.containedSections"),
						peInfo.sections?.length
					)}
				</ul>
			)}
			{peInfo.sections?.length > 0 && (
				<DetailsTable<PESection>
					title={t("analysisPage.analyzedData.details.file.sections")}
					headers={[
						t("analysisPage.analyzedData.details.file.tableHeaderSections1"),
						t("analysisPage.analyzedData.details.file.tableHeaderSections2"),
						t("analysisPage.analyzedData.details.file.tableHeaderSections3"),
						t("analysisPage.analyzedData.details.file.tableHeaderSections4"),
						t("analysisPage.analyzedData.details.file.tableHeaderSections5"),
						t("analysisPage.analyzedData.details.file.tableHeaderSections6"),
						t("analysisPage.analyzedData.details.file.tableHeaderSections7"),
					]}
					data={peInfo.sections}
					columns={[
						"name",
						"flags",
						"raw_size",
						"virtual_address",
						"virtual_size",
						"entropy",
						"md5",
					]}
				/>
			)}
			{peInfo.import_list?.length > 0 && (
				<KeyValueList
					title={t("analysisPage.analyzedData.details.file.imports")}
					data={peInfo.import_list.map((item) => item.library_name)}
				/>
			)}
			{peInfo.resource_types && (
				<KeyValueList
					title={t("analysisPage.analyzedData.details.file.resourcesByType")}
					data={peInfo.resource_types}
				/>
			)}
			{peInfo.resource_langs && (
				<KeyValueList
					title={t("analysisPage.analyzedData.details.file.resourcesByLanguage")}
					data={peInfo.resource_langs}
				/>
			)}
			{peInfo.resource_details?.length > 0 && (
				<DetailsTable<PEResourceDetais>
					title={t("analysisPage.analyzedData.details.file.containedResources")}
					headers={[
						t("analysisPage.analyzedData.details.file.tableHeaderResources1"),
						t("analysisPage.analyzedData.details.file.tableHeaderResources2"),
						t("analysisPage.analyzedData.details.file.tableHeaderResources3"),
						t("analysisPage.analyzedData.details.file.tableHeaderResources4"),
						t("analysisPage.analyzedData.details.file.tableHeaderResources5"),
						t("analysisPage.analyzedData.details.file.tableHeaderResources6"),
					]}
					data={peInfo.resource_details}
					columns={["chi2", "entropy", "filetype", "lang", "sha256", "type"]}
				/>
			)}
			{peInfo.overlay && (
				<KeyValueList
					title={t("analysisPage.analyzedData.details.file.overlay")}
					data={peInfo.overlay}
				/>
			)}
		</li>
	)
);

const BundleInfoSection = ({
	bundleInfo,
	t,
}: {
	bundleInfo: BundleInfo | undefined;
	t: TFunction;
}) => (
	bundleInfo && Object.keys(bundleInfo).length > 0 && (
		<li className={CLASS_NAMES.ITEM}>
			<h1>{t("analysisPage.analyzedData.details.file.bundleInfo")}</h1>
			<ul className={CLASS_NAMES.CONTAINER}>
				<li className={CLASS_NAMES.TITLE}>
					{t("analysisPage.analyzedData.details.file.contentsMetadata")}
				</li>
				{renderDetail(
					t("analysisPage.analyzedData.details.file.containedFiles"),
					bundleInfo.num_children
				)}
				{renderDetail(
					t("analysisPage.analyzedData.details.file.uncompressedSize"),
					bundleInfo.uncompressed_size && formatBytes(bundleInfo.uncompressed_size)
				)}
				{renderDetail(
					t("analysisPage.analyzedData.details.file.earliestModification"),
					bundleInfo.lowest_datetime
				)}
				{renderDetail(
					t("analysisPage.analyzedData.details.file.latestModification"),
					bundleInfo.highest_datetime
				)}
			</ul>
			<KeyValueList
				title={t("analysisPage.analyzedData.details.file.filesByType")}
				data={bundleInfo.file_types}
			/>
			<KeyValueList
				title={t("analysisPage.analyzedData.details.file.filesByExtension")}
				data={bundleInfo.extensions}
			/>
		</li>
	)
);

// Основной компонент
export default function FileDetails({ fileAnalysisResults }: FileDetailsProps) {
	const { t } = useTranslation();
	const attributes = fileAnalysisResults?.data?.attributes;

	if (!fileAnalysisResults || !fileAnalysisResults.data || !attributes) {
		return <p className={CLASS_NAMES.NO_DATA}>No data</p>;
	}

	const signatureInfo = useMemo(
		() => (attributes.signature_info ? transformSignatureInfo(attributes.signature_info) : null),
		[attributes.signature_info]
	);

	return (
		<>
			<MainProperties attributes={attributes} t={t} />
			<HistorySection attributes={attributes} t={t} />
			{attributes.names && <NamesSection names={attributes.names} t={t} />}
			<SignatureSection signatureInfo={signatureInfo} t={t} />
			<PeInfoSection peInfo={attributes.pe_info} t={t} />
			<BundleInfoSection bundleInfo={attributes.bundle_info} t={t} />
		</>
	);
}