<script lang="ts">
  import { onMount } from 'svelte';
  import axios, { type AxiosResponse } from 'axios';
  import {
    Button,
    Container,
    InputWrapper,
    Input,
    Flex,
    Card,
    Progress,
    Text
  } from '@svelteuidev/core';
  import Toast from '../lib/Toast.svelte';

  const endpoint = `http://localhost:3000/upload`;

  let selectedFile: File | undefined;
  let isUploading: boolean = false;
  let uploadProgress: number = 0;
  let uploadedFiles: string[] = [];
  let error: string = '';

  let showToast = false;
  let toastMessage = '';
  let toastType = 'default';

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      selectedFile = input.files[0];
    }
  }

  async function uploadFile() {
    showToastMessage('Uploading');
    error = '';
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        console.log('Upload file to: ', endpoint);
        const response = (await axios.post(endpoint, formData, {
          onUploadProgress: (progressEvent) => {
            uploadProgress = Math.round(
              (progressEvent.loaded * 100) /
                (progressEvent.total ?? selectedFile!.size)
            );
          }
        })) as AxiosResponse;

        if (response.status === 200) {
          showToastMessage(response.data['message'], 'success');
          uploadedFiles = [...uploadedFiles, response.data['data']];
        }
      } catch (error) {
        showToastMessage('File upload failed.', 'error');
      }
    } else {
      showToastMessage('No file selected.', 'error');
    }
    isUploading = false;
  }

  function showToastMessage(message: string, type: string = 'default') {
    toastMessage = message;
    showToast = true;
    toastType = type;

    if (type !== 'loading') {
      setTimeout(() => {
        showToast = false;
      }, 5000);
    }
  }

  onMount(() => {
    uploadProgress = 0;
  });
</script>

<Container size="xs" override={{ px: 'lg' }}>
  <Card shadow="sm" padding="lg">
    <Flex direction="column" gap="md">
      <InputWrapper
        label="Upload CSV File"
        description="only .csv files accepted."
        disabled={isUploading}
        required
      >
        <Input type="file" accept=".csv" on:change={handleFileChange} />
      </InputWrapper>

      <Button variant="light" color="blue" fullSize on:click={uploadFile}>
        Upload
      </Button>

      {#if isUploading}
        <Progress
          value={uploadProgress}
          label={uploadProgress}
          size="xl"
          striped
          animate
        />
      {/if}

      {#if uploadedFiles.length > 0}
        <div>
          <Text size="lg">Uploaded Files</Text>
          <ul>
            {#each uploadedFiles as item}
              <li>
                <Text variant="link" root="a" href={`/data/${item}`}>
                  {item.slice(14)}
                </Text>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </Flex>
  </Card>
  <Toast message={toastMessage} visible={showToast} type={toastType} />
</Container>
