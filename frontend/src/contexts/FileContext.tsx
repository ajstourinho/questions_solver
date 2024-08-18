import { createContext, useCallback, useContext, useState } from "react"

interface IFileContext {
    file: File | undefined
    receiveFile: (newFile : File) => void
}
const FileContext = createContext({} as IFileContext)

export const useFileContext = () => {
    return useContext(FileContext)
}

interface IFileContextProvider {
    children: React.ReactNode
}

export function FileContextProvider ({ children }: IFileContextProvider) {
    const [file, setFile] = useState<File | undefined>(undefined)

    const receiveFile = function (newFile : File) {
        console.log('file was received')
        setFile(newFile)
    }
    return(
        <FileContext.Provider value={{file, receiveFile}}>
            {children}
        </FileContext.Provider>
    )
}