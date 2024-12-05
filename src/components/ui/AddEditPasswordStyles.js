import styled from 'styled-components';

// Additional styles specific to AddEditPassword component
export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

export const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
`;

export const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const PageContent = styled.main`
  max-width: 800px;
  margin: 24px auto;
  padding: 0 24px;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`;

export const GeneratorSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`;

export const GeneratorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const GeneratorToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: #eff6ff;
  }
`;

export const GeneratorOptions = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LengthControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Slider = styled.input`
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin: 0;
`;