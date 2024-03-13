export const Body = () => (
    <div className="flex flex-col  bg-gray-200 p-8 min-h-screen">
        <button className="flex justify-start flex-row mb-2">
            <div className="flex flex-col items-center justify-center m-2 bg-white rounded shadow-lg w-40 h-44">
                <div className="text-gray-400 text-9xl font-thin bg-gradient-to-r from-red-500 via-green-500  to-blue-400 inline-block text-transparent bg-clip-text">+</div>
                <p className="text-sm text-gray-800">Create New Doc</p>
            </div>
        </button>
        <h2 className="self-start text-lg font-semibold text-gray-700 mb-4">Recent Documents</h2>
        <div className="flex flex-wrap">
            <DocumentIcon name="Quarterly Report" />
            <DocumentIcon name="Quarterly Report" />
            <DocumentIcon name="Quarterly Report" />
        </div>
    </div>
);

const DocumentIcon = ({ name }: { name: string }) => (
    <button className="m-2 mr-20 mb-8 rounded">
        <div className="flex flex-col items-center justify-center w-40 h-44 bg-white shadow">
        </div>
        <p className="text-sm text-gray-800 text-center mt-2">{name}</p>
    </button>
);