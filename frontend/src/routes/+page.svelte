<script>
    import { enhance } from "$app/forms";
    import {
        Button,
        Container,
        InputWrapper,
        Input,
        Flex,
        Card,
    } from "@svelteuidev/core";

    /**
     * @type File
     */
    let file;
    let isLoading = false;
    let isUploading = true;
    let progress = 0;
    let error = "";
    export let form;

    function uploadFile() {
        if (!file) {
            error = "File is required!";
            return;
        }

        console.log("Start Upload");
        isLoading = true;
        isUploading = true;
        progress++;

        console.log(file);
    }

    $: if (file) {
        console.log(`${file.name}: ${file.size} bytes`);
    }
</script>

<Container size="xs" override={{ px: "xs" }}>
    <Card shadow="sm" padding="lg">
        <form
            method="POST"
            action="?/create"
            use:enhance
            enctype="multipart/form-data"
        >
            <Flex direction="column" gap="md">
                <InputWrapper
                    label="Upload CSV File"
                    description="only .csv files accepted."
                    {error}
                    disabled={isLoading}
                    required
                >
                    <Input
                        id="file"
                        name="fileToUpload"
                        type="file"
                        accept=".csv"
                        bind:value={file}
                        required
                    />
                </InputWrapper>

                {#if form?.error}
                    <p class="error">{form.error}</p>
                {/if}

                <Button
                    variant="light"
                    color="blue"
                    fullSize
                    on:click={uploadFile}
                >
                    Upload
                </Button>
            </Flex>
        </form>
    </Card>
</Container>
