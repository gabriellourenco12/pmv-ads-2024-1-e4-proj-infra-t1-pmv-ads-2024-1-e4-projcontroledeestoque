'use client'
import 'react-toastify/dist/ReactToastify.css'
import React, {useEffect, useRef, useState} from 'react'
import Navigation from '../components/Navigation'
import {Fornecedor, getFornecedores} from '../services/fornecedores'
import {NotePencil, TrashSimple} from '@phosphor-icons/react'
import DeleteModal from '../components/FornecedorModal/DeleteModalFornecedor'
import FornecedorModal from '../components/FornecedorModal/FornecedorModal'
import {toast, ToastContainer} from 'react-toastify'
import EditFornecedorModal from '../components/FornecedorModal/EditFornecedorModal'
import {Loading} from '@/app/components/Loading'
import {URLS} from '@/app/utils/constantes'
import {useRouter} from 'next/navigation'
import {getTokenData} from '@/app/utils/token-data'

export default function Fornecedores() {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
    const [filter, setFilter] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null)
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const router = useRouter()
    const formRef = useRef(null)

    const updateFornecedores = () => {
        getFornecedores().then((data) => {
            setFornecedores(() => data)
        })
    }

    const handleToast = (message: string) => {
        setTimeout(() => toast.success(message), 300)
    }

    const handleCloseDeleteModal = () => {
        setDeleteModal(!deleteModal)
        updateFornecedores()
    }

    const handleOpenDeleteModal = (fornecedor: Fornecedor) => {
        setFornecedor(fornecedor)
        setDeleteModal(!deleteModal)
    }

    const handleCloseCreateModal = () => {
        setCreateModal(!createModal)
        updateFornecedores()
    }

    const handleOpenCreateModal = () => {
        setCreateModal(!createModal)
    }

    const handleCloseEditModal = () => {
        setEditModal(!editModal)
        updateFornecedores()
    }

    const handleOpenEditModal = (fornecedor: Fornecedor) => {
        setFornecedor(fornecedor)
        setEditModal(!editModal)
    }

    const handleSearch = () => {
        getFornecedores({name: filter}).then((data) => {
            setFornecedores(data)
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleSearch()
    }

    useEffect(() => {
        const tokenData = getTokenData()
        setAccessToken(tokenData?.accessToken || null)
        setLoading(false)
    }, [])

    useEffect(() => {
        updateFornecedores()
    }, [filter])

    if (loading) {
        return <Loading/>
    }

    if (!accessToken) {
        router.push(URLS.LOGIN_PATH)
        return
    }

    return editModal ? (
        <EditFornecedorModal
            fornecedor={fornecedor || {id: '', nome: '', contato: '', endereco: ''}}
            handleCloseEditModal={handleCloseEditModal}
            handleToast={handleToast}
        />
    ) : createModal ? (
        <FornecedorModal handleCloseCreateModal={handleCloseCreateModal} handleToast={handleToast}/>
    ) : deleteModal ? (
        fornecedor ? (
            <DeleteModal
                handleCloseDeleteModal={handleCloseDeleteModal}
                handleToast={handleToast}
                fornecedor={fornecedor}
                setDeleteModal={setDeleteModal}
            />
        ) : null
    ) : (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div>
                <div className="flex w-full justify-between">
                    <Navigation/>
                    <button
                        onClick={handleOpenCreateModal}
                        className="middle none text-zinc-950 center mr-4 rounded-lg bg-amber-600 py-3 px-6 font-sans text-xs font-bold uppercase shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        data-ripple-light="true"
                    >
                        Novo Fornecedor
                    </button>
                </div>
            </div>

            <div className="mt-8 max-w-2xl mx-auto mb-6">
                <form ref={formRef} onSubmit={handleSubmit}>
                    <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
                        Search
                    </label>
                    <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                            placeholder="Loja, Empresa, etc."
                            required
                        />
                        <button
                            type="submit"
                            className="text-white absolute right-2.5 bottom-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                        >
                            Pesquisar
                        </button>
                    </div>
                </form>
            </div>

            <div>
                <table className="w-full">
                    <thead>
                    <tr className="bg-gray-900 py-2">
                        <th className="py-1 px-4 max-w-prose">Nome</th>
                        <th className="py-1 px-4 max-w-prose">Contato</th>
                        <th className="py-1 px-4 max-w-prose">Endereço</th>
                        <th className="py-1 px-4 max-w-prose"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {fornecedores.map((fornecedor, index) => (
                        <tr
                            className={`bg-gray-${index % 2 === 0 ? '950' : '900'} py-2`}
                            key={fornecedor.id}
                        >
                            <td
                                className="py-1 px-4 max-w-prose"
                            >
                                <div className="text-amber-600">{fornecedor.nome}</div>
                            </td>
                            <td className="py-1 px-4 max-w-prose">{fornecedor.contato}</td>
                            <td className="py-1 px-4 max-w-prose">{fornecedor.endereco}</td>
                            <td className="py-1 px-4 max-w-prose">
                                <button
                                    className="hover:bg-yellow-800 rounded-md mr-2"
                                    onClick={() => handleOpenEditModal(fornecedor)}>
                                    <NotePencil size={20}/>
                                </button>
                                <button
                                    className="hover:bg-red-800 rounded-md"
                                    onClick={() => handleOpenDeleteModal(fornecedor)}>
                                    <TrashSimple size={20}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
