export const sleep = async (timeout = 2000) => await (
    new Promise((res) => setTimeout(() => {res(true)}, timeout))
)