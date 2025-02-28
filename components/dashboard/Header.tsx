'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { getJwtClient } from "@/services/getJwtClient";
import { useUserStore } from "@/states/zustand/user";
import { Modal } from "antd";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import nProgress from "nprogress";
import { Fragment, useMemo, useState } from "react";
import { Button } from "../ui/button";

export function Header() {

    const [openModal, setOpenModal] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    let paths = pathname.split('/').filter(Boolean);

    paths = paths?.length > 0 ? paths : ['Dashboard'];

    const routes = useMemo(
        () => paths.slice(0, paths.length - 1).map((path, index) => {
            const route = `/${paths.slice(0, index + 1).join('/')}`;
            return route;
        }),
        [paths]
    );


    const onLogout = () => {
        nProgress.start();
        getJwtClient().removeJwt();
        const { removeJwt } = useUserStore.getState() as { removeJwt: () => void };
        removeJwt();
        nProgress.done();
        router.replace('/login');
    }

    return (
        <header
            className="px-4 h-20 sticky top-0 z-10  flex items-center justify-between bg-neutral-300"
        >
            <Breadcrumb>
                <BreadcrumbList>
                    {
                        paths.map((path, index) => {
                            const route = routes[index];

                            return (
                                <Fragment
                                    key={path}
                                >
                                    <BreadcrumbItem
                                        key={path}
                                        className=" uppercase font-semibold text-base"
                                    >
                                        {
                                            index === paths.length - 1 && (
                                                <BreadcrumbPage>
                                                    {path}
                                                </BreadcrumbPage>
                                            )
                                        }
                                        {
                                            index < paths.length - 1 && (
                                                <BreadcrumbLink
                                                    href={route}
                                                >
                                                    {path}
                                                </BreadcrumbLink>
                                            )
                                        }
                                    </BreadcrumbItem>
                                    {
                                        index < paths.length - 1 && (
                                            <BreadcrumbSeparator />
                                        )
                                    }
                                </Fragment>
                            )

                        })
                    }
                </BreadcrumbList>
            </Breadcrumb>

            <Button
                size={'icon'}
                variant={'destructive'}
                onClick={() => setOpenModal(true)}
            >
                <LogOut />
            </Button>
            <Modal
                title="Logout"
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={onLogout}
                okText="Yes"
                okButtonProps={{
                    danger: true
                }}
                cancelText="No"
                width={400}
                centered
            >
                <p>
                    Are you sure you want to logout?
                </p>
            </Modal>
        </header >
    )
}
